import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export default async function AdminMessagesPage() {
  const messages = await prisma.messageLog.findMany({
    include: {
      appointment: {
        include: {
          service: { select: { name: true } },
          client: { select: { fullName: true, email: true } },
        },
      },
    },
    orderBy: { sentAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-dark">Message Logs</h1>
        <p className="text-muted-foreground">Track confirmations, reminders, and follow-ups.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sent Messages</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-muted-foreground">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Client</th>
                <th className="p-2">Service</th>
                <th className="p-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message.id} className="border-b">
                  <td className="p-2">{new Date(message.sentAt).toLocaleString()}</td>
                  <td className="p-2">{message.appointment.client.fullName} ({message.appointment.client.email})</td>
                  <td className="p-2">{message.appointment.service.name}</td>
                  <td className="p-2">{message.messageType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
