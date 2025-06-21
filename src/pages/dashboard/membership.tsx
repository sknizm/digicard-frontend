
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Gem, Check, Zap } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { config } from "@/lib/config";
import { AppContext } from "@/context/AppContext";
import BouncingDotsLoader from "@/components/ui/bounce-loader";

export default function Membership() {
  const [loading, setLoading] = useState(true);
  const [membership, setMembership] = useState<null | {
    membership: boolean;
    expiry_date?: string;
    planType?: string | null;
  }>(null);

  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  const { token } = context;

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const res = await fetch(`${config.backend_url}/api/check-membership`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch membership");

        const data = await res.json();
        setMembership(data);
      } catch (error) {
        console.error("Error fetching membership:", error);
        setMembership(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [token]);

  if (loading) return <BouncingDotsLoader />;
  if (!membership) return <div className="p-4 md:p-8 text-red-500">Unable to load membership info.</div>;

  const daysLeft =
    membership?.membership && membership.expiry_date
      ? differenceInDays(parseISO(membership.expiry_date), new Date()) + 1
      : 0;

  const isExpired = !membership.membership || daysLeft <= 0;
  const hasLongTermAccess = daysLeft > 10;
  const currentPlan = hasLongTermAccess ? "Lifetime Access" : membership.planType || "Free Trial";

 
  const plans = [
  {
    name: "Yearly Plan",
    price: "₹299/year",
    description: "Affordable yearly subscription for your digital identity",
    features: [
      "Create your digital business card",
      "Share via link or QR code",
      "Add your photo, profession, contact & social links",
      "Customizable design & layout",
      "Responsive mobile-friendly card",
      "Analytics to track views",
      "Fast support & regular updates",
    ],
    cta: "Get Started for ₹299/year",
    popular: true,
  },
];


  const handleCtaClick = (planName: string) => {
    const message = `Hi, I want to get the ${planName}. Please assist me.`;
    const url = `https://wa.me/918455838503?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Plan Status */}
      <Card className="bg-gradient-to-r from-green-100 via-yellow-50 to-white border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-green-700 text-xl">
            <Clock className="w-5 h-5" />
            {isExpired
              ? "Plan Expired"
              : hasLongTermAccess
              ? "Lifetime Access"
              : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left in your plan`}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 text-sm">
          {isExpired ? (
            <>Please choose a plan to continue using the service.</>
          ) : hasLongTermAccess ? (
            <>You have unlimited lifetime access to all features.</>
          ) : (
            <>
              Your current <strong>{currentPlan}</strong> plan expires on{" "}
              <strong>{membership.expiry_date}</strong>.
            </>
          )}
        </CardContent>
      </Card>

      {/* Current Plan */}
      {!isExpired && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Gem className="text-purple-600" />
                {currentPlan} Plan
              </span>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md">
                Current Plan
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            {hasLongTermAccess ? (
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <span>You have full lifetime access to all current and future features!</span>
              </div>
            ) : (
              "Enjoy full access to all features. You can upgrade when new plans are available."
            )}
          </CardContent>
        </Card>
      )}

      {/* Pricing Table - Only show if expired or doesn't have lifetime access */}
      {(isExpired || !hasLongTermAccess) && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Upgrade to <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Lifetime Access</span>
            </h2>
            <p className="text-gray-600 text-lg">One payment, unlimited access forever.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-6 border rounded-xl ${
                  plan.popular ? "border-green-300 shadow-lg" : "border-gray-200 shadow-sm"
                } hover:shadow-md transition-all`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    BEST VALUE
                  </div>
                )}

                <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="block text-sm text-gray-500 mt-1">
                    one-time payment
                  </span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleCtaClick(plan.name)}
                  className={`w-full bg-gradient-to-r from-green-600 to-green-600 text-white hover:from-green-700 hover:to-green-700 transition-all`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}