import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function PricingPage() {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <div className="mx-auto max-w-3xl px-4 py-16 text-center md:py-24">
                <h1 className="text-4xl font-bold tracking-tight">Pricing</h1>
                <p className="mt-3 text-muted-foreground">
                    Docables is free while we build the product.
                </p>
                <Card className="mx-auto mt-10 max-w-md text-left">
                    <CardContent className="space-y-4 p-6">
                        <p className="text-sm font-medium text-muted-foreground">Free</p>
                        <h2 className="text-3xl font-bold">$0</h2>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Unlimited private notes</li>
                            <li>Email OTP and Google sign-in</li>
                            <li>Public share links</li>
                            <li>Archive and restore</li>
                        </ul>
                        <Button className="w-full" onClick={() => navigate("/login")}>
                            Get started
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
