import { NextResponse } from "next/server";
import { getAvailableDates, validateLocationType } from "@/lib/availability";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const month = searchParams.get("month");
  const serviceId = searchParams.get("serviceId");
  const locationType = validateLocationType(searchParams.get("locationType"));

  if (!month || !serviceId || !locationType) {
    return NextResponse.json(
      { error: "Missing or invalid query params: month, serviceId, locationType" },
      { status: 400 }
    );
  }

  try {
    const availableDates = await getAvailableDates(month, serviceId, locationType);
    return NextResponse.json({ month, availableDates });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch available dates",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
