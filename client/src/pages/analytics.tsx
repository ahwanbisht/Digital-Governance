import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { DownloadIcon, RefreshCcw } from "lucide-react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("year");
  const [department, setDepartment] = useState("all");

  // Budget data
  const { data: budgetData, isLoading: loadingBudget } = useQuery<any>({
    queryKey: ["/api/budget"],
  });

  // Anomalies data
  const { data: anomaliesData, isLoading: loadingAnomalies } = useQuery<any>({
    queryKey: ["/api/anomalies"],
  });

  // Sample data for charts (would be replaced with real data from API)
  const budgetSpendingData = [
    { month: 'Jan', Allocated: 4.2, Spent: 3.8 },
    { month: 'Feb', Allocated: 4.5, Spent: 4.2 },
    { month: 'Mar', Allocated: 4.8, Spent: 4.5 },
    { month: 'Apr', Allocated: 5.0, Spent: 4.7 },
    { month: 'May', Allocated: 5.2, Spent: 4.9 },
    { month: 'Jun', Allocated: 5.5, Spent: 5.1 },
    { month: 'Jul', Allocated: 5.8, Spent: 5.3 },
    { month: 'Aug', Allocated: 6.0, Spent: 5.5 },
    { month: 'Sep', Allocated: 6.2, Spent: 5.7 },
    { month: 'Oct', Allocated: 6.5, Spent: 5.9 },
    { month: 'Nov', Allocated: 6.8, Spent: 6.1 },
    { month: 'Dec', Allocated: 7.0, Spent: 6.3 },
  ];

  const departmentBudgetData = [
    { name: 'Education', value: 35 },
    { name: 'Healthcare', value: 30 },
    { name: 'Infrastructure', value: 25 },
    { name: 'Security', value: 10 },
  ];

  const COLORS = ['#3b82f6', '#14b8a6', '#f59e0b', '#dc2626'];

  const anomalyTrendData = [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 15 },
    { month: 'Mar', count: 11 },
    { month: 'Apr', count: 18 },
    { month: 'May', count: 14 },
    { month: 'Jun', count: 19 },
    { month: 'Jul', count: 16 },
    { month: 'Aug', count: 21 },
    { month: 'Sep', count: 17 },
    { month: 'Oct', count: 22 },
    { month: 'Nov', count: 18 },
    { month: 'Dec', count: 15 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 mb-1">Analytics</h1>
        <p className="text-neutral-600">AI-powered analytics and trends for governance data</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs defaultValue="budget" className="w-full">
          <TabsList>
            <TabsTrigger value="budget">Budget Analytics</TabsTrigger>
            <TabsTrigger value="anomalies">Anomaly Trends</TabsTrigger>
            <TabsTrigger value="reports">Citizen Reports</TabsTrigger>
            <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
            <div className="flex gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Current Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <TabsContent value="budget" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Budget Allocation vs Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={budgetSpendingData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis label={{ value: 'Amount (Millions)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip formatter={(value) => [`$${value}M`, '']} />
                        <Legend />
                        <Bar dataKey="Allocated" fill="#3b82f6" />
                        <Bar dataKey="Spent" fill="#14b8a6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Budget Distribution by Department</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={departmentBudgetData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {departmentBudgetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Budget Share']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="anomalies" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Anomaly Detection Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={anomalyTrendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#dc2626" name="Anomalies Detected" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-700">High Priority</h3>
                    <p className="text-3xl font-bold text-red-800 mt-2">8</p>
                    <p className="text-sm text-red-600 mt-1">Anomalies requiring immediate action</p>
                  </div>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                    <h3 className="text-lg font-semibold text-amber-700">Medium Priority</h3>
                    <p className="text-3xl font-bold text-amber-800 mt-2">15</p>
                    <p className="text-sm text-amber-600 mt-1">Anomalies requiring investigation</p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-700">Resolved</h3>
                    <p className="text-3xl font-bold text-green-800 mt-2">42</p>
                    <p className="text-sm text-green-600 mt-1">Anomalies addressed and resolved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Citizen Report Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-80">
                  <p className="text-neutral-500">Citizen report analytics visualization will be available soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="predictions" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Predictions & Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-80">
                  <p className="text-neutral-500">AI prediction module is currently in development</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
