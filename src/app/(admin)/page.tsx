
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <>
      <header className="flex h-16 items-center border-b bg-background px-6 shrink-0">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>
              This is your new, stable admin panel. You can manage your store from here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Select an option from the sidebar to get started.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
