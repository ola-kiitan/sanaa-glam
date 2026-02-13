import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";

/**
 * Admin Dashboard — Overview page with key metrics and quick actions.
 * 
 * TODO: Phase 5 — Connect to real data from the database:
 * - Today's appointments count
 * - Upcoming appointments this week
 * - Total clients
 * - Completion rate
 * - Recent appointments list
 * - Quick actions (create appointment, manage services)
 */
export default function AdminDashboardPage() {
  // Placeholder stats — will be replaced with real database queries
  const stats = [
    { label: "Today's Appointments", value: "0", icon: Calendar, color: "text-primary" },
    { label: "This Week", value: "0", icon: Clock, color: "text-plum-light" },
    { label: "Total Clients", value: "0", icon: Users, color: "text-plum" },
    { label: "Completed", value: "0", icon: CheckCircle, color: "text-green-600" },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-plum-dark">
          Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here&apos;s an overview of your appointments.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-plum-dark">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for recent appointments */}
      <Card className="mt-8 border-border/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-plum-dark">
            Recent Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground py-8">
            No appointments yet. The appointment list will appear here once
            bookings are made.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
