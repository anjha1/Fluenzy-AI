"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UpgradeButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          couponCode: couponCode.trim() || undefined,
          targetPlan: "Pro",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Free upgrade success
          alert(data.message || "Successfully upgraded to Pro!");
          window.location.reload(); // Refresh to show new plan
        } else if (data.orderId) {
          // Initialize Razorpay checkout
          const options = {
            key: data.key,
            amount: data.amount,
            currency: data.currency,
            order_id: data.orderId,
            name: "Fluenzy AI",
            description: "Pro Plan Upgrade",
            handler: async function (response: any) {
              // Verify payment on backend
              const verifyRes = await fetch("/api/verify-razorpay-payment", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  order_id: data.orderId,
                  plan: "Pro",
                }),
              });

              if (verifyRes.ok) {
                alert("Payment successful! You have been upgraded to Pro.");
                window.location.reload();
              } else {
                alert("Payment verification failed. Please contact support.");
              }
            },
            prefill: {
              email: "", // Will be filled from session
              contact: "",
            },
            theme: {
              color: "#7c3aed",
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          alert("Unexpected response from server");
        }
      } else {
        const error = await res.json();
        console.error("Failed to create order:", error);
        alert(error.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Upgrade to Pro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            Enter a coupon code (optional) and proceed to payment.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="coupon" className="text-right">
              Coupon Code
            </Label>
            <Input
              id="coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="col-span-3"
              placeholder="Optional"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade} disabled={isLoading}>
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}