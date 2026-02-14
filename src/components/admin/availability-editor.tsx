"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Rule = {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  bufferMinutes: number;
  allowTravel: boolean;
};

type Blackout = { id: string; startAt: string; endAt: string; reason: string | null };

type EditableRule = {
  weekday: number;
  isOpen: boolean;
  startTime: string;
  endTime: string;
  bufferMinutes: number;
  allowTravel: boolean;
};

const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

function buildEditableRules(initialRules: Rule[]): EditableRule[] {
  const byWeekday = new Map(initialRules.map((rule) => [rule.weekday, rule]));

  return Array.from({ length: 7 }, (_, weekday) => {
    const existing = byWeekday.get(weekday);
    if (existing) {
      return {
        weekday,
        isOpen: true,
        startTime: existing.startTime,
        endTime: existing.endTime,
        bufferMinutes: existing.bufferMinutes,
        allowTravel: existing.allowTravel,
      };
    }

    return {
      weekday,
      isOpen: false,
      startTime: "09:00",
      endTime: "18:00",
      bufferMinutes: 15,
      allowTravel: true,
    };
  });
}

export function AvailabilityEditor({
  initialRules,
  initialBlackouts,
}: {
  initialRules: Rule[];
  initialBlackouts: Blackout[];
}) {
  const [rules, setRules] = useState<EditableRule[]>(() => buildEditableRules(initialRules));
  const [blackouts, setBlackouts] = useState(initialBlackouts);
  const [blackoutForm, setBlackoutForm] = useState({ startAt: "", endAt: "", reason: "" });
  const [savingRules, setSavingRules] = useState(false);
  const [rulesMessage, setRulesMessage] = useState<string | null>(null);
  const [blackoutMessage, setBlackoutMessage] = useState<string | null>(null);

  const openRuleCount = useMemo(
    () => rules.filter((rule) => rule.isOpen).length,
    [rules]
  );

  function updateRule(index: number, next: Partial<EditableRule>) {
    setRules((prev) => prev.map((rule, i) => (i === index ? { ...rule, ...next } : rule)));
  }

  async function saveRules() {
    setSavingRules(true);
    setRulesMessage(null);

    const payload = rules
      .filter((rule) => rule.isOpen)
      .map((rule) => ({
        weekday: rule.weekday,
        startTime: rule.startTime,
        endTime: rule.endTime,
        bufferMinutes: rule.bufferMinutes,
        allowTravel: rule.allowTravel,
      }));

    const response = await fetch("/api/admin/availability/rules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as { rules?: Rule[]; error?: string };

    if (!response.ok) {
      setRulesMessage(data.error ?? "Failed to save weekly rules.");
      setSavingRules(false);
      return;
    }

    setRules(buildEditableRules(data.rules ?? []));
    setRulesMessage("Weekly availability saved.");
    setSavingRules(false);
  }

  async function addBlackout() {
    setBlackoutMessage(null);

    const response = await fetch("/api/admin/availability/blackout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blackoutForm),
    });

    const data = (await response.json()) as { blackout?: Blackout; error?: string };

    if (!response.ok || !data.blackout) {
      setBlackoutMessage(data.error ?? "Failed to add blackout date.");
      return;
    }

    const blackout = data.blackout;
    setBlackouts((prev) => [...prev, blackout]);
    setBlackoutForm({ startAt: "", endAt: "", reason: "" });
    setBlackoutMessage("Blackout date added.");
  }

  async function deleteBlackout(id: string) {
    const response = await fetch(`/api/admin/availability/blackout/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setBlackoutMessage("Failed to delete blackout date.");
      return;
    }
    setBlackouts((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold text-plum-dark">Weekly Rules</h3>
          <p className="text-xs text-muted-foreground">
            Open days: {openRuleCount}/7
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {rules.map((rule, index) => (
            <div key={rule.weekday} className="rounded border p-3">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-plum-dark">{WEEKDAY_LABELS[rule.weekday]}</p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={rule.isOpen}
                    onChange={(event) => updateRule(index, { isOpen: event.target.checked })}
                  />
                  Open for bookings
                </label>
              </div>

              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <Label>Start</Label>
                  <Input
                    value={rule.startTime}
                    onChange={(event) => updateRule(index, { startTime: event.target.value })}
                    disabled={!rule.isOpen}
                  />
                </div>
                <div>
                  <Label>End</Label>
                  <Input
                    value={rule.endTime}
                    onChange={(event) => updateRule(index, { endTime: event.target.value })}
                    disabled={!rule.isOpen}
                  />
                </div>
                <div>
                  <Label>Buffer (minutes)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={120}
                    value={rule.bufferMinutes}
                    onChange={(event) =>
                      updateRule(index, { bufferMinutes: Number(event.target.value || 0) })
                    }
                    disabled={!rule.isOpen}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={rule.allowTravel}
                      onChange={(event) => updateRule(index, { allowTravel: event.target.checked })}
                      disabled={!rule.isOpen}
                    />
                    Allow Travel
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button className="mt-4" onClick={() => void saveRules()} disabled={savingRules}>
          {savingRules ? "Saving..." : "Save Weekly Rules"}
        </Button>

        {rulesMessage ? (
          <p className="mt-2 text-sm text-muted-foreground">{rulesMessage}</p>
        ) : null}
      </div>

      <div className="rounded-xl border p-4">
        <h3 className="font-semibold text-plum-dark">Future Blackout Dates</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Block specific future dates (vacation, holidays, private events).
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={blackoutForm.startAt}
              onChange={(event) => setBlackoutForm({ ...blackoutForm, startAt: event.target.value })}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={blackoutForm.endAt}
              onChange={(event) => setBlackoutForm({ ...blackoutForm, endAt: event.target.value })}
            />
          </div>
          <div>
            <Label>Reason</Label>
            <Input
              value={blackoutForm.reason}
              onChange={(event) => setBlackoutForm({ ...blackoutForm, reason: event.target.value })}
            />
          </div>
        </div>

        <Button className="mt-4" onClick={() => void addBlackout()}>
          Add Blackout
        </Button>

        {blackoutMessage ? (
          <p className="mt-2 text-sm text-muted-foreground">{blackoutMessage}</p>
        ) : null}

        <div className="mt-4 space-y-2">
          {blackouts.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border p-3 text-sm">
              <span>
                {new Date(item.startAt).toLocaleDateString()} → {new Date(item.endAt).toLocaleDateString()} ({item.reason || "No reason"})
              </span>
              <Button variant="outline" size="sm" onClick={() => void deleteBlackout(item.id)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
