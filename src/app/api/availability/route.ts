import { NextResponse } from "next/server";
import { getAvailableSlots, validateLocationType } from "@/lib/availability";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const locationType = validateLocationType(searchParams.get("locationType"));

  if (!date || !serviceId || !locationType) {
    return NextResponse.json(
      { error: "Missing or invalid query params: date, serviceId, locationType" },
      { status: 400 }
    );
  }

  try {
    const slots = await getAvailableSlots(date, serviceId, locationType);
    return NextResponse.json({ date, slots });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch availability",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
