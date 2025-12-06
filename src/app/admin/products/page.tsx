
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminProductsPage() {
  return (
    <>
      <header className="flex h-16 items-center border-b bg-background px-6 shrink-0">
        <h1 className="text-xl font-semibold tracking-tight">Products</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>
              This is where you will manage your products.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Product list and management tools will go here.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
