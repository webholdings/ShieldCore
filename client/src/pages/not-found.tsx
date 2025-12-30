import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-md glass-card border-0 shadow-xl">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-heading font-bold">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-center text-muted-foreground">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
