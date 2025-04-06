import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { apiRequest } from "@/lib/queryClient";

type BudgetData = {
  department: string;
  allocation: number;
  spending: number;
};

export function BudgetAllocationChart() {
  const [timeRange, setTimeRange] = useState("30");
  
  const { data, isLoading } = useQuery<{data: BudgetData[]}>({
    queryKey: ["/api/budget"],
  });

  // Format data for chart
  const chartData = data?.data || [
    { department: "Education", allocation: 4200000, spending: 3800000 },
    { department: "Healthcare", allocation: 3700000, spending: 3200000 },
    { department: "Infrastructure", allocation: 5100000, spending: 4800000 }
  ];

  // Format data for chart display
  const formatChartData = () => {
    return chartData.map(item => ({
      department: item.department,
      Allocation: item.allocation / 1000000, // Convert to millions
      Spending: item.spending / 1000000
    }));
  };

  // Get summary data for department cards
  const getSummaryData = () => {
    return chartData.map(item => ({
      name: item.department,
      value: `$${(item.allocation / 1000000).toFixed(1)}M`
    }));
  };

  return (
    <Card>
      <CardHeader className="pb-0 border-b border-neutral-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Budget Allocation & Spending</CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[160px] h-8 text-sm">
                <SelectValue placeholder="Select Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last 12 months</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-700">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-5">
        <div className="h-64">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formatChartData()} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="department" />
                <YAxis tickFormatter={(tick) => `$${tick}M`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toFixed(1)}M`, 'Amount']}
                  labelFormatter={(label) => `Department: ${label}`}
                />
                <Legend />
                <Bar dataKey="Allocation" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spending" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          {getSummaryData().map((dept, index) => (
            <div 
              key={index} 
              className={`text-center px-2 py-3 rounded-md ${
                index === 0 ? 'bg-primary-50' : 
                index === 1 ? 'bg-secondary-50' : 'bg-neutral-100'
              }`}
            >
              <p className="text-sm text-neutral-500">{dept.name}</p>
              <p className={`font-bold ${
                index === 0 ? 'text-primary-700' : 
                index === 1 ? 'text-secondary-700' : 'text-neutral-700'
              }`}>
                {dept.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default BudgetAllocationChart;
