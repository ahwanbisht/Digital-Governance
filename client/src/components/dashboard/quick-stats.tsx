import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, FilesIcon, BarChartIcon, MessageSquareIcon, BrainIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
  totalRecords: number;
  budgetTransparency: string;
  citizenReports: number;
  anomalies: number;
};

export function QuickStats() {
  const { data, isLoading } = useQuery<{ stats: Stats }>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = data?.stats || {
    totalRecords: 0,
    budgetTransparency: "0%",
    citizenReports: 0,
    anomalies: 0
  };

  const statItems = [
    {
      title: "Total Public Records",
      value: stats.totalRecords.toLocaleString(),
      change: "+5.3% this month",
      trend: "up",
      icon: <FilesIcon className="h-6 w-6 text-primary-500" />,
      bgColor: "bg-primary-50"
    },
    {
      title: "Budget Transparency",
      value: stats.budgetTransparency,
      change: "+2.1% this month",
      trend: "up",
      icon: <BarChartIcon className="h-6 w-6 text-secondary-600" />,
      bgColor: "bg-secondary-50"
    },
    {
      title: "Citizen Reports",
      value: stats.citizenReports.toLocaleString(),
      change: "-3.8% this month",
      trend: "down",
      icon: <MessageSquareIcon className="h-6 w-6 text-amber-500" />,
      bgColor: "bg-amber-100"
    },
    {
      title: "AI Anomaly Detections",
      value: stats.anomalies.toLocaleString(),
      change: "+1.2% this month",
      trend: "up",
      icon: <BrainIcon className="h-6 w-6 text-neutral-700" />,
      bgColor: "bg-neutral-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-5">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">{item.title}</p>
                <p className="text-2xl font-bold text-neutral-800">{item.value}</p>
                <p className={`text-xs flex items-center mt-1 ${
                  item.trend === "up" 
                    ? "text-green-500" 
                    : "text-red-500"
                }`}>
                  {item.trend === "up" ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  <span>{item.change}</span>
                </p>
              </div>
              <div className={`${item.bgColor} rounded-full p-3 h-fit`}>
                {item.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default QuickStats;
