import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Starter",
    subtitle: "Ideal for small projects",
    price: "Free",
    priceNote: "",
    features: [
      "Unlimited personal files",
      "Email support",
      "CSV data export",
      "Basic analytics dashboard",
      "1,000 API calls per month",
    ],
    button: "Try for free",
    highlight: false,
    badge: null,
    featurePrefix: (
      <span className="inline-block w-4 h-4 mr-2 align-middle">⚙️</span>
    ),
    pricePer: "",
  },
  {
    name: "Professional",
    subtitle: "For freelancers and startups",
    price: "$15",
    priceNote: "/per user",
    features: [
      <span key="all-starter">
        <span className="inline-block align-middle text-primary mr-2">✔️</span>{" "}
        <span className="font-semibold">All starter features +</span>
      </span>,
      "Up to 5 user accounts",
      "Team collaboration tools",
      "Custom dashboards",
      "Multiple data export formats",
      "Basic custom integrations",
    ],
    button: "Select plan",
    highlight: true,
    badge: "MOST POPULAR PLAN",
    featurePrefix: (
      <span className="inline-block w-4 h-4 mr-2 align-middle">⚙️</span>
    ),
    pricePer: "/per user",
  },
  {
    name: "Organization",
    subtitle: "For fast-growing businesses",
    price: "$30",
    priceNote: "/per user",
    features: [
      <span key="all-pro">
        <span className="inline-block align-middle text-primary mr-2">✔️</span>{" "}
        <span className="font-semibold">All professional features +</span>
      </span>,
      "Enterprise security suite",
      "Single Sign-On (SSO)",
      "Custom contract terms",
      "Dedicated phone support",
      "Custom integration support",
      "Compliance tools",
    ],
    button: "Select plan",
    highlight: false,
    badge: null,
    featurePrefix: (
      <span className="inline-block w-4 h-4 mr-2 align-middle">⚙️</span>
    ),
    pricePer: "/per user",
  },
];

const PlanCard: React.FC = () => {
  return (
    <>
      {plans.map((plan) => (
        <div key={plan.name} className={`w-full relative  flex flex-col justify-center rounded-4xl items-center ${plan.highlight ? 'bg-primary px-1  pb-1 md:-mt-12' : ''}`}>
        {plan.highlight && (<h2 className="text-center py-4 text-[12px] font-medium">Most Popular Plan</h2>)}
        
          <Card
            key={plan.name}
            className={`flex flex-col w-full h-full p-5 bg-white justify-between py-6 border- transition-all duration-200
           ${plan.highlight ? "border-none" : ""}
            rounded-4xl
          `}>
            <CardHeader className=" border-6-red">
              <CardTitle
                className={` text-[#1A1A1A] text-[20px] font-bold ${
                  plan.highlight
                    ? "text-[20px] font-bold"
                    : "text-[20px] font-bold"
                }`}
              >
                {plan.name}
              </CardTitle>
              <CardDescription className="text-base text-[#666666] text-[14px] mb-2">
                {plan.subtitle}
              </CardDescription>
              <div className="flex items-center justify-start gap-1">
                <span
                  className={`font-bold ${
                    plan.highlight ? "text-[32px]" : "text-[32px]"
                  } ${plan.price === "Free" ? "text-black" : "text-gray-900"}`}
                >
                  {plan.price}
                </span>
                {plan.priceNote && (
                  <span className="text-[32px] font-bold text-[#1A1A1A]">
                    {plan.priceNote}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 px-6 pb-0">
              <ul className="flex flex-col gap-3 text-left">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start text-sm text-gray-700"
                  >
                    {typeof feature === "string" ? (
                      <>
                        <span className="inline-block w-4 h-4 mr-2 mt-0.5 text-[#1A1A1A]">
                          ⚙️
                        </span>
                        {feature}
                      </>
                    ) : (
                      feature
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex justify-center pt-6 pb-2">
              <Button
                className={`w-full max-w-[236px] rounded-full py-2 text-base font-semibold ${
                  plan.highlight
                    ? "bg-[#1A1A1A] hover:bg-gray-700 text-white shadow-lg"
                    : "bg-[#1A1A1A] hover:bg-gray-700 text-white"
                }`}
                size="lg"
              >
                {plan.button}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </>
  );
};

export default PlanCard;
