import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, BadgeCheck, CircleCheck, Sparkles } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { supabase, TUTOR_PROFILES_TABLE } from "../lib/supabase";
import {
  buildPayHereHash,
  ensurePayHereScript,
  getPayHereConfig,
  validatePayHereConfig
} from "../lib/payhere";
import { saveTutorProStatus } from "../lib/tutorProStatus";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const plans = [
  {
    id: "pro-plus",
    name: "Pro Plus",
    description: "Growth plan for active tutors",
    price: 2900,
    features: [
      { text: "Profile boost in tutor search" },
      { text: "Verified blue mark on tutor card and profile" },
      { text: "Priority placement in subject categories" },
      { text: "Basic Pro analytics dashboard" }
    ],
    button: { text: "Pay with PayHere" }
  },
  {
    id: "pro-max",
    name: "Pro Max",
    description: "Maximum visibility for serious tutors",
    price: 4900,
    features: [
      { text: "Everything in Pro Plus" },
      { text: "Stronger boost in lists and featured rows" },
      { text: "Priority support response" },
      { text: "Advanced lead insights and conversion trends" }
    ],
    button: { text: "Pay with PayHere" }
  }
];

export default function TutorProPlanPage() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [payingPlanId, setPayingPlanId] = useState("");
  const [message, setMessage] = useState("");

  const fullName = useMemo(() => {
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split("@")[0];
    return "Tutor";
  }, [user?.user_metadata?.name, user?.email]);

  if (user?.user_metadata?.role === "student") {
    return <Navigate to="/student-dashboard" replace />;
  }

  const applyProSuccess = async (plan) => {
    if (!user?.id) return;
    saveTutorProStatus(user.id, {
      planId: plan.id,
      isBoosted: true,
      verifiedBlueMark: true,
      verifiedMarks: 5
    });

    // Best effort DB update (works once schema has pro columns).
    if (supabase) {
      await supabase
        .from(TUTOR_PROFILES_TABLE)
        .update({
          profile_boost: true,
          verified_marks: 5
        })
        .eq("id", user.id);
    }
    await refreshProfile?.();
  };

  const handlePay = async (plan) => {
    if (!user?.id) return;
    setMessage("");
    setPayingPlanId(plan.id);
    try {
      const payhere = await ensurePayHereScript();
      const cfg = getPayHereConfig();
      const configError = validatePayHereConfig(cfg);
      if (configError) {
        setMessage(configError);
        setPayingPlanId("");
        return;
      }
      payhere.onCompleted = async () => {
        await applyProSuccess(plan);
        setMessage("Payment success! Verified blue mark and profile boost are now active.");
        setPayingPlanId("");
        navigate("/payment/success");
      };
      payhere.onDismissed = () => {
        setMessage("Payment cancelled.");
        setPayingPlanId("");
        navigate("/payment/failed");
      };
      payhere.onError = (err) => {
        setMessage(`PayHere error: ${String(err || "Unknown error")}`);
        setPayingPlanId("");
        navigate("/payment/failed");
      };

      const split = fullName.trim().split(/\s+/);
      const firstName = split[0] || cfg.firstName;
      const lastName = split.slice(1).join(" ") || cfg.lastName;
      const orderId = `TUTORPRO-${plan.id}-${Date.now()}`;
      const paymentHash = buildPayHereHash({
        merchantId: cfg.merchantId,
        orderId,
        amount: plan.price,
        currency: "LKR",
        merchantSecret: cfg.merchantSecret
      });
      const payment = {
        sandbox: true,
        merchant_id: cfg.merchantId,
        hash: paymentHash,
        return_url: cfg.returnUrl,
        cancel_url: cfg.cancelUrl,
        notify_url: cfg.notifyUrl,
        order_id: orderId,
        items: `${plan.name} subscription`,
        amount: plan.price.toFixed(2),
        currency: "LKR",
        first_name: firstName,
        last_name: lastName,
        email: user.email || "tutor@example.com",
        phone: "0771234567",
        address: cfg.address,
        city: cfg.city,
        country: cfg.country,
        custom_1: user.id,
        custom_2: plan.id
      };
      payhere.startPayment(payment);
    } catch (error) {
      setMessage("Could not start PayHere checkout. Applying success in demo mode.");
      await applyProSuccess(plan);
      setPayingPlanId("");
    }
  };

  return (
    <section
      data-locked
      className="relative min-h-screen overflow-hidden bg-white py-24 text-slate-900"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-8">
          <Link
            to="/tutor-dashboard"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            <ArrowLeft size={12} /> Back to dashboard
          </Link>
        </div>

        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <h2 className="text-pretty text-4xl font-bold lg:text-6xl">
            Tutor Pro Plans
          </h2>
          <p className="max-w-3xl text-slate-600 lg:text-xl">
            Choose a plan and complete payment to activate profile boost and a
            verified blue mark on your profile.
          </p>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            <BadgeCheck className="size-4" />
            Secure PayHere checkout
          </div>

          <div className="mt-2 flex flex-col items-stretch gap-6 md:flex-row">
            {plans.map((plan, i) => (
              <Card
                key={plan.id}
                className={`flex w-80 flex-col justify-between border-slate-200 bg-white text-left shadow-sm ${
                  i === 1 ? "ring-2 ring-slate-950/10" : ""
                }`}
              >
                <CardHeader>
                  <CardTitle>
                    <p className="text-slate-900">{plan.name}</p>
                  </CardTitle>
                  <p className="text-sm text-slate-600">{plan.description}</p>
                  <span className="text-4xl font-bold text-slate-900">
                    LKR {plan.price.toLocaleString()}
                  </span>
                  <p className="text-slate-500">One-time checkout</p>
                </CardHeader>

                <CardContent>
                  <Separator className="mb-6 bg-slate-200" />
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={`${plan.id}-${index}`} className="flex items-center gap-2 text-slate-700">
                        <CircleCheck className="size-4 text-slate-500" />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Sparkles className="size-3" /> Includes verified blue mark + profile boost
                  </div>
                </CardContent>

                <CardFooter className="mt-auto bg-transparent p-4">
                  <Button
                    type="button"
                    onClick={() => handlePay(plan)}
                    disabled={payingPlanId === plan.id}
                    className="w-full rounded-lg bg-slate-950 text-white hover:bg-slate-800"
                  >
                    {payingPlanId === plan.id ? "Processing..." : plan.button.text}
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          {message ? (
            <p className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {message}
            </p>
          ) : null}
          <p className="text-xs text-slate-500">Complete payment to activate Pro status instantly.</p>
          <div className="mt-2">
            <Button asChild variant="outline">
              <Link to="/tutors">
                View public profiles
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
