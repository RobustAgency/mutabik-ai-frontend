import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const infoCards = [
	{ label: "Monthly Revenue", value: "$192.1K" },
	{ label: "Customers", value: "1320" },
	{ label: "Projects", value: "3543" },
];

const DashboardInfoCards: React.FC = () => {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
			{infoCards.map((card, idx) => (
				<Card key={idx} className="flex-1 min-w-0">
					<CardHeader>
						<CardTitle className=" text-[#737373] text-sm font-medium ">{card.label}</CardTitle>
					</CardHeader>
					<CardContent>
						<span className="text-3xl text-[#171717] font-semibold">{card.value}</span>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default DashboardInfoCards;
