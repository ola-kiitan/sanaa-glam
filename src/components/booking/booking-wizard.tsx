"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, Loader2, MapPin } from "lucide-react";
import type { LocationType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { BOOKING_CUTOFF_HOURS, BUSINESS_INFO, GLAM_LEVEL_LABELS, SKIN_TYPE_LABELS, ZONES } from "@/lib/constants";
import type { ServiceForDisplay } from "@/lib/actions/services";
import type { TimeSlot } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type BookingWizardProps = {
  services: ServiceForDisplay[];
  initialServiceSlug?: string;
};

type TravelZone = "ZONE_1" | "ZONE_2" | "ZONE_3";

type ClientFormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
};

type IntakeFormState = {
  skinType: "DRY" | "OILY" | "COMBINATION" | "NORMAL" | "";
  allergies: string;
  occasion: string;
  glamLevel: "NATURAL" | "SOFT_GLAM" | "FULL_GLAM" | "EDITORIAL" | "";
  inspirationUrl: string;
  clientNotes: string;
};

type PoliciesState = {
  terms: boolean;
  privacy: boolean;
  cancellation: boolean;
};

function getResolvedPrice(
  service: ServiceForDisplay,
  locationType: LocationType | null,
  zone: TravelZone | null
): number {
  if (locationType === "STUDIO") return service.studioPrice;
  if (zone === "ZONE_1") return service.zone1Price;
  if (zone === "ZONE_2") return service.zone2Price;
  if (zone === "ZONE_3") return service.zone3Price;
  return service.studioPrice;
}

function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function BookingWizard({ services, initialServiceSlug }: BookingWizardProps) {
  const router = useRouter();

  const initialService = useMemo(
    () => services.find((service) => service.slug === initialServiceSlug),
    [services, initialServiceSlug]
  );

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(initialService ? 2 : 1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [serviceId, setServiceId] = useState<string | null>(initialService?.id ?? null);
  const [locationType, setLocationType] = useState<LocationType | null>(null);
  const [zone, setZone] = useState<TravelZone | null>(null);

  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
  const [loadingDates, setLoadingDates] = useState(false);
  const monthDatesCacheRef = useRef<Map<string, string[]>>(new Map());
  const datesAbortControllerRef = useRef<AbortController | null>(null);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const slotsCacheRef = useRef<Map<string, TimeSlot[]>>(new Map());
  const slotsAbortControllerRef = useRef<AbortController | null>(null);

  const [clientDetails, setClientDetails] = useState<ClientFormState>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [intakeForm, setIntakeForm] = useState<IntakeFormState>({
    skinType: "",
    allergies: "",
    occasion: "",
    glamLevel: "",
    inspirationUrl: "",
    clientNotes: "",
  });

  const [policies, setPolicies] = useState<PoliciesState>({
    terms: false,
    privacy: false,
    cancellation: false,
  });

  const selectedService = services.find((service) => service.id === serviceId) ?? null;
  const price = selectedService ? getResolvedPrice(selectedService, locationType, zone) : 0;

  const fetchAvailableDates = useCallback(async (
    monthDate: Date,
    overrides?: { serviceId?: string; locationType?: LocationType }
  ) => {
    const effectiveServiceId = overrides?.serviceId ?? serviceId;
    const effectiveLocationType = overrides?.locationType ?? locationType;
    if (!effectiveServiceId || !effectiveLocationType) return;

    const month = format(monthDate, "yyyy-MM");
    const cacheKey = `${month}:${effectiveServiceId}:${effectiveLocationType}`;
    const cached = monthDatesCacheRef.current.get(cacheKey);
    if (cached) {
      setAvailableDates(new Set(cached));
      return;
    }

    datesAbortControllerRef.current?.abort();
    const controller = new AbortController();
    datesAbortControllerRef.current = controller;

    setLoadingDates(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/availability/dates?month=${month}&serviceId=${effectiveServiceId}&locationType=${effectiveLocationType}`,
        { signal: controller.signal }
      );

      const data = (await response.json()) as { availableDates?: string[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch available dates");
      }

      const fetchedDates = data.availableDates ?? [];
      monthDatesCacheRef.current.set(cacheKey, fetchedDates);
      setAvailableDates(new Set(fetchedDates));
    } catch (fetchError) {
      if (controller.signal.aborted) {
        return;
      }
      setAvailableDates(new Set());
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load available dates");
    } finally {
      if (datesAbortControllerRef.current === controller) {
        setLoadingDates(false);
      }
    }
  }, [locationType, serviceId]);

  async function fetchSlotsForDate(date: Date) {
    if (!serviceId || !locationType) return;

    const dateKey = toDateKey(date);
    const cacheKey = `${dateKey}:${serviceId}:${locationType}`;
    const cached = slotsCacheRef.current.get(cacheKey);
    if (cached) {
      setSlots(cached);
      setSelectedTimeSlot(null);
      return;
    }

    slotsAbortControllerRef.current?.abort();
    const controller = new AbortController();
    slotsAbortControllerRef.current = controller;

    setLoadingSlots(true);
    setError(null);
    setSelectedTimeSlot(null);

    try {
      const response = await fetch(
        `/api/availability?date=${dateKey}&serviceId=${serviceId}&locationType=${locationType}`,
        { signal: controller.signal }
      );

      const data = (await response.json()) as { slots?: TimeSlot[]; error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch slots");
      }

      const fetchedSlots = data.slots ?? [];
      slotsCacheRef.current.set(cacheKey, fetchedSlots);
      setSlots(fetchedSlots);
    } catch (fetchError) {
      if (controller.signal.aborted) {
        return;
      }
      setSlots([]);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load time slots");
    } finally {
      if (slotsAbortControllerRef.current === controller) {
        setLoadingSlots(false);
      }
    }
  }

  function handleSelectService(nextServiceId: string) {
    setServiceId(nextServiceId);
    setLocationType(null);
    setZone(null);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setAvailableDates(new Set());
    setSlots([]);
    datesAbortControllerRef.current?.abort();
    slotsAbortControllerRef.current?.abort();
    setError(null);
    setStep(2);
  }

  async function handleSelectLocation(nextLocationType: LocationType) {
    setLocationType(nextLocationType);
    setSelectedDate(undefined);
    setSelectedTimeSlot(null);
    setSlots([]);
    if (nextLocationType === "STUDIO") {
      setZone(null);
      setStep(4);
      await fetchAvailableDates(calendarMonth, { locationType: nextLocationType });
    } else {
      setStep(3);
    }
  }

  async function handleSelectZone(nextZone: TravelZone) {
    setZone(nextZone);
    setStep(4);
    await fetchAvailableDates(calendarMonth, { locationType: "TRAVEL" });
  }

  useEffect(() => {
    if (step === 4 && serviceId && locationType) {
      void fetchAvailableDates(calendarMonth);
    }
  }, [step, serviceId, locationType, calendarMonth, fetchAvailableDates]);

  function isDateDisabled(day: Date): boolean {
    const dayKey = toDateKey(day);
    return !availableDates.has(dayKey);
  }

  function canContinueStep5(): boolean {
    if (!clientDetails.fullName.trim()) return false;
    if (!clientDetails.email.trim()) return false;
    if (!clientDetails.phone.trim()) return false;
    if (locationType === "TRAVEL" && clientDetails.address.trim().length < 6) return false;
    return true;
  }

  async function submitBooking() {
    if (!selectedService || !locationType || !selectedDate || !selectedTimeSlot) {
      setError("Please complete all required steps before confirming your booking.");
      return;
    }

    if (!policies.terms || !policies.privacy || !policies.cancellation) {
      setError("Please accept all policies to continue.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        serviceId: selectedService.id,
        locationType,
        zone: locationType === "TRAVEL" ? zone : undefined,
        date: toDateKey(selectedDate),
        timeSlot: selectedTimeSlot,
        clientDetails: {
          fullName: clientDetails.fullName,
          email: clientDetails.email,
          phone: clientDetails.phone,
          address: locationType === "TRAVEL" ? clientDetails.address : "",
        },
        intakeForm,
        policyAccepted: true,
      };

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        success?: boolean;
        appointmentId?: string;
        summary?: {
          serviceName: string;
          date: string;
          time: string;
          locationType: LocationType;
          zone: TravelZone | null;
          price: number;
        };
        error?: string;
      };

      if (!response.ok || !result.success || !result.summary || !result.appointmentId) {
        throw new Error(result.error ?? "Booking failed. Please try another slot.");
      }

      const params = new URLSearchParams({
        appointmentId: result.appointmentId,
        service: result.summary.serviceName,
        date: result.summary.date,
        time: result.summary.time,
        location: result.summary.locationType,
        zone: result.summary.zone ?? "",
        price: String(result.summary.price),
      });

      router.push(`/booking/confirmation?${params.toString()}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  }

  const stepLabels = [
    "Service",
    "Location",
    "Zone",
    "Date & Time",
    "Details",
    "Confirm",
  ] as const;

  const effectiveStep = locationType === "STUDIO" && step === 4 ? 3 : step;

  return (
    <div className="mt-10 space-y-8">
      <div className="rounded-xl border border-border/50 bg-card p-5">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {stepLabels.map((label, index) => {
            const number = (index + 1) as 1 | 2 | 3 | 4 | 5 | 6;
            const active = effectiveStep === number;
            const completed = effectiveStep > number;

            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    completed
                      ? "bg-primary text-primary-foreground"
                      : active
                        ? "bg-plum text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {number}
                </div>
                <span className="hidden text-xs text-muted-foreground sm:block">{label}</span>
                {index < stepLabels.length - 1 && <div className="h-px w-6 bg-border" />}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Step 1: Select Service</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => handleSelectService(service.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  serviceId === service.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-secondary/40"
                }`}
              >
                <p className="font-serif text-lg font-semibold text-plum-dark">{service.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {service.durationMinutes} min
                  </span>
                  <span className="font-semibold text-primary">From EUR {service.studioPrice}</span>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {step === 2 && selectedService && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Step 2: Select Location</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => void handleSelectLocation("STUDIO")}
              className={`rounded-xl border p-5 text-left transition ${
                locationType === "STUDIO"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-secondary/40"
              }`}
            >
              <p className="text-lg font-semibold text-plum-dark">Studio</p>
              <p className="mt-2 text-sm text-muted-foreground">{BUSINESS_INFO.studioAddress}</p>
            </button>

            <button
              type="button"
              onClick={() => void handleSelectLocation("TRAVEL")}
              className={`rounded-xl border p-5 text-left transition ${
                locationType === "TRAVEL"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-secondary/40"
              }`}
            >
              <p className="text-lg font-semibold text-plum-dark">Travel</p>
              <p className="mt-2 text-sm text-muted-foreground">We come to your location within 50 km.</p>
            </button>
          </CardContent>
        </Card>
      )}

      {step === 3 && locationType === "TRAVEL" && selectedService && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Step 3: Select Zone</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {(Object.keys(ZONES) as TravelZone[]).map((key) => {
              const zonePrice =
                key === "ZONE_1"
                  ? selectedService.zone1Price
                  : key === "ZONE_2"
                    ? selectedService.zone2Price
                    : selectedService.zone3Price;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => void handleSelectZone(key)}
                  className={`rounded-xl border p-4 text-left transition ${
                    zone === key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-secondary/40"
                  }`}
                >
                  <p className="font-semibold text-plum-dark">{ZONES[key].label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{ZONES[key].distance}</p>
                  <p className="mt-2 text-sm font-semibold text-primary">EUR {zonePrice}</p>
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      {step === 4 && selectedService && locationType && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Step 4: Select Date & Time</CardTitle>
            <p className="text-sm text-muted-foreground">
              Only dates with at least one available slot are enabled. Booking cutoff is {BOOKING_CUTOFF_HOURS} hours.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <Calendar
                mode="single"
                selected={selectedDate}
                month={calendarMonth}
                onMonthChange={(month) => {
                  setCalendarMonth(month);
                  void fetchAvailableDates(month);
                }}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    void fetchSlotsForDate(date);
                  } else {
                    setSlots([]);
                    setSelectedTimeSlot(null);
                  }
                }}
                disabled={(day) => isDateDisabled(day)}
                className="rounded-lg border"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-plum-dark">
                <CalendarIcon className="h-4 w-4" />
                {selectedDate ? format(selectedDate, "EEEE, dd MMMM yyyy") : "Select a date"}
              </div>

              {loadingSlots ? (
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading slots...
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        !slot.available
                          ? "cursor-not-allowed border-border bg-muted text-muted-foreground"
                          : selectedTimeSlot === slot.time
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/40 hover:bg-secondary"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep(locationType === "STUDIO" ? 2 : 3)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(5)}
                disabled={!selectedDate || !selectedTimeSlot || loadingDates || loadingSlots}
              >
                Continue
              </Button>
            </div>

            {loadingDates && (
              <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Checking monthly availability...
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {step === 5 && selectedService && locationType && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Step 5: Client Details & Intake</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={clientDetails.fullName}
                  onChange={(event) =>
                    setClientDetails((prev) => ({ ...prev, fullName: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={clientDetails.email}
                  onChange={(event) =>
                    setClientDetails((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={clientDetails.phone}
                  onChange={(event) =>
                    setClientDetails((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </div>

              {locationType === "TRAVEL" && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={clientDetails.address}
                    onChange={(event) =>
                      setClientDetails((prev) => ({ ...prev, address: event.target.value }))
                    }
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Skin Type</Label>
                <Select
                  value={intakeForm.skinType}
                  onValueChange={(value) =>
                    setIntakeForm((prev) => ({ ...prev, skinType: value as IntakeFormState["skinType"] }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select skin type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SKIN_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Glam Level</Label>
                <Select
                  value={intakeForm.glamLevel}
                  onValueChange={(value) =>
                    setIntakeForm((prev) => ({ ...prev, glamLevel: value as IntakeFormState["glamLevel"] }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select glam level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GLAM_LEVEL_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="occasion">Occasion</Label>
                <Input
                  id="occasion"
                  value={intakeForm.occasion}
                  onChange={(event) =>
                    setIntakeForm((prev) => ({ ...prev, occasion: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="inspirationUrl">Inspiration URL</Label>
                <Input
                  id="inspirationUrl"
                  value={intakeForm.inspirationUrl}
                  onChange={(event) =>
                    setIntakeForm((prev) => ({ ...prev, inspirationUrl: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={intakeForm.allergies}
                  onChange={(event) =>
                    setIntakeForm((prev) => ({ ...prev, allergies: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientNotes">Additional Notes</Label>
                <Textarea
                  id="clientNotes"
                  value={intakeForm.clientNotes}
                  onChange={(event) =>
                    setIntakeForm((prev) => ({ ...prev, clientNotes: event.target.value }))
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep(4)}>
                Back
              </Button>
              <Button onClick={() => setStep(6)} disabled={!canContinueStep5()}>
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 6 && selectedService && locationType && selectedDate && selectedTimeSlot && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl">Step 6: Confirm & Book</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-lg border border-border/60 bg-secondary/30 p-4">
              <div className="grid gap-2 text-sm">
                <p><span className="font-semibold">Service:</span> {selectedService.name}</p>
                <p><span className="font-semibold">Date:</span> {format(selectedDate, "EEEE, dd MMM yyyy")}</p>
                <p><span className="font-semibold">Time:</span> {selectedTimeSlot}</p>
                <p className="inline-flex items-center gap-1">
                  <span className="font-semibold">Location:</span>
                  <MapPin className="h-3 w-3" /> {locationType === "STUDIO" ? "Studio" : "Travel"}
                  {zone && <Badge variant="secondary">{ZONES[zone].label}</Badge>}
                </p>
                <p><span className="font-semibold">Price:</span> EUR {price}</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={policies.terms}
                  onCheckedChange={(checked) =>
                    setPolicies((prev) => ({ ...prev, terms: checked === true }))
                  }
                />
                <span>
                  I accept the <Link href="/agb" className="text-primary underline">Terms & Conditions</Link>
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={policies.privacy}
                  onCheckedChange={(checked) =>
                    setPolicies((prev) => ({ ...prev, privacy: checked === true }))
                  }
                />
                <span>
                  I accept the <Link href="/datenschutz" className="text-primary underline">Privacy Policy</Link>
                </span>
              </label>

              <label className="flex items-start gap-3 text-sm">
                <Checkbox
                  checked={policies.cancellation}
                  onCheckedChange={(checked) =>
                    setPolicies((prev) => ({ ...prev, cancellation: checked === true }))
                  }
                />
                <span>
                  I accept the <Link href="/stornierung" className="text-primary underline">Cancellation Policy</Link>
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setStep(5)} disabled={submitting}>
                Back
              </Button>
              <Button onClick={() => void submitBooking()} disabled={submitting}>
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Confirming...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
