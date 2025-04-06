import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Sector 
} from "recharts";
import { Download, RefreshCw, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { BudgetAllocation } from "@shared/schema";

// Colors for pie chart
const COLORS = ["#3b82f6", "#14b8a6", "#f59e0b", "#dc2626", "#8b5cf6", "#ec4899"];

export default function BudgetTracking() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [quarter, setQuarter] = useState("all");
  const [department, setDepartment] = useState("all");
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: budgetData, isLoading } = useQuery<BudgetAllocation[]>({
    queryKey: ["/api/budget"],
  });

  // Process budget data for charts
  const processBudgetData = () => {
    if (!budgetData) return [];
    
    let filtered = budgetData;
    
    if (year !== "all") {
      filtered = filtered.filter(item => item.year.toString() === year);
    }
    
    if (quarter !== "all") {
      filtered = filtered.filter(item => item.quarter.toString() === quarter);
    }
    
    if (department !== "all") {
      filtered = filtered.filter(item => item.department === department);
    }
    
    return filtered;
  };

  // Aggregate budget allocations by department
  const getBudgetByDepartment = () => {
    const processed = processBudgetData();
    const departments: {[key: string]: number} = {};
    
    processed.forEach(item => {
      if (departments[item.department]) {
        departments[item.department] += item.amount;
      } else {
        departments[item.department] = item.amount;
      }
    });
    
    return Object.entries(departments).map(([name, value]) => ({
      name,
      value: parseFloat((value / 1000000).toFixed(1)) // Convert to millions
    }));
  };

  // Aggregate budget allocations by quarter
  const getBudgetByQuarter = () => {
    const processed = processBudgetData();
    const quarters: {[key: string]: number} = {
      "Q1": 0,
      "Q2": 0,
      "Q3": 0,
      "Q4": 0
    };
    
    processed.forEach(item => {
      quarters[`Q${item.quarter}`] += item.amount;
    });
    
    return Object.entries(quarters).map(([name, value]) => ({
      name,
      amount: parseFloat((value / 1000000).toFixed(1)) // Convert to millions
    }));
  };

  // Get spending vs allocation data
  const getSpendingData = () => {
    // This would normally come from API, using mock data for now
    return [
      { month: 'Jan', allocated: 4.2, spent: 3.8 },
      { month: 'Feb', allocated: 4.5, spent: 4.2 },
      { month: 'Mar', allocated: 4.8, spent: 4.5 },
      { month: 'Apr', allocated: 5.0, spent: 4.7 },
      { month: 'May', allocated: 5.2, spent: 4.9 },
      { month: 'Jun', allocated: 5.5, spent: 5.1 },
      { month: 'Jul', allocated: 5.8, spent: 5.3 },
      { month: 'Aug', allocated: 6.0, spent: 5.5 },
      { month: 'Sep', allocated: 6.2, spent: 5.7 },
      { month: 'Oct', allocated: 6.5, spent: 5.9 },
      { month: 'Nov', allocated: 6.8, spent: 6.1 },
      { month: 'Dec', allocated: 7.0, spent: 6.3 }
    ];
  };

  // Custom active shape for PieChart
  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-midAngle * Math.PI / 180);
    const cos = Math.cos(-midAngle * Math.PI / 180);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">
          ${value}M ({(percent * 100).toFixed(0)}%)
        </text>
      </g>
    );
  };

  // Get anomaly data (would come from API in real implementation)
  const getAnomalyData = () => {
    return [
      { id: 1, department: "Transportation", amount: "$245,000", date: "Oct 5, 2023", reason: "Unusual spending pattern" },
      { id: 2, department: "Education", amount: "$178,500", date: "Sep 28, 2023", reason: "Deviation from allocated budget" },
      { id: 3, department: "Public Works", amount: "$312,000", date: "Sep 15, 2023", reason: "Spending spike detected" }
    ];
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 mb-1">Budget Tracking</h1>
        <p className="text-neutral-600">Monitor, analyze, and track government spending with blockchain verification</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={quarter} onValueChange={setQuarter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Quarter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Quarters</SelectItem>
              <SelectItem value="1">Q1</SelectItem>
              <SelectItem value="2">Q2</SelectItem>
              <SelectItem value="3">Q3</SelectItem>
              <SelectItem value="4">Q4</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Infrastructure">Infrastructure</SelectItem>
              <SelectItem value="Public Works">Public Works</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-neutral-800">$14.8M</p>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+3.2% from previous year</span>
                </p>
              </div>
              <div className="bg-primary-50 rounded-full p-3 h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Spent Amount</p>
                <p className="text-2xl font-bold text-neutral-800">$9.2M</p>
                <p className="text-xs text-neutral-500 flex items-center mt-1">
                  <span>62% of total budget</span>
                </p>
              </div>
              <div className="bg-secondary-50 rounded-full p-3 h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <Progress value={62} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-neutral-500 mb-1">Budget Anomalies</p>
                <p className="text-2xl font-bold text-neutral-800">3</p>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>-2 from previous month</span>
                </p>
              </div>
              <div className="bg-red-50 rounded-full p-3 h-fit">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Skeleton className="h-full w-full rounded-md" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      activeIndex={activeIndex}
                      activeShape={renderActiveShape}
                      data={getBudgetByDepartment()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      dataKey="value"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                    >
                      {getBudgetByDepartment().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quarterly Budget Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Skeleton className="h-full w-full rounded-md" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getBudgetByQuarter()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Amount (Millions)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`$${value}M`, 'Amount']} />
                    <Bar dataKey="amount" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Actual Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getSpendingData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Amount (Millions)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`$${value}M`, '']} />
                  <Legend />
                  <Line type="monotone" dataKey="allocated" stroke="#3b82f6" name="Allocated" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="spent" stroke="#14b8a6" name="Spent" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>AI-Detected Budget Anomalies</CardTitle>
            <Badge variant="destructive">3 Anomalies</Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getAnomalyData().map((anomaly) => (
                  <TableRow key={anomaly.id}>
                    <TableCell className="font-medium">{anomaly.department}</TableCell>
                    <TableCell>{anomaly.amount}</TableCell>
                    <TableCell>{anomaly.date}</TableCell>
                    <TableCell>{anomaly.reason}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Investigate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Separator className="my-4" />
            
            <div className="bg-amber-50 border border-amber-100 rounded-md p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-medium text-amber-800">Anomaly Detection</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Anomalies are detected using machine learning algorithms that analyze spending patterns and identify deviations from expected behavior. All anomalies are recorded on the blockchain for transparency.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
