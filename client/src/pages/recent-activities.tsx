import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarIcon, FileText, AlertCircle, User, ArrowRight, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Mock activity data (would be fetched from API in real implementation)
const activityData = [
  {
    id: 1,
    type: "record",
    title: "New public record created",
    description: "Contract REC-2023-5842 was added to Public Works department",
    timestamp: new Date(2023, 9, 12, 14, 32),
    user: "John Davis",
    status: "success"
  },
  {
    id: 2,
    type: "anomaly",
    title: "Anomaly detected",
    description: "Unusual spending pattern detected in Transportation department",
    timestamp: new Date(2023, 9, 12, 12, 15),
    severity: "high",
    status: "warning"
  },
  {
    id: 3,
    type: "report",
    title: "Citizen report submitted",
    description: "Anonymous report regarding infrastructure issue",
    timestamp: new Date(2023, 9, 12, 10, 45),
    status: "info"
  },
  {
    id: 4,
    type: "verification",
    title: "Record verification",
    description: "Budget allocation REC-2023-5841 verified on blockchain",
    timestamp: new Date(2023, 9, 11, 16, 22),
    hash: "0x6b21...8e32",
    status: "success"
  },
  {
    id: 5,
    type: "anomaly",
    title: "Contract signature verification failed",
    description: "Digital signature on contract does not match authorized signatory",
    timestamp: new Date(2023, 9, 11, 14, 8),
    severity: "medium",
    status: "warning"
  },
  {
    id: 6,
    type: "record",
    title: "Record status updated",
    description: "Expenditure report REC-2023-5840 flagged for review",
    timestamp: new Date(2023, 9, 10, 11, 27),
    user: "Sarah Johnson",
    status: "warning"
  },
  {
    id: 7,
    type: "login",
    title: "Admin user login",
    description: "Administrator accessed the system",
    timestamp: new Date(2023, 9, 10, 9, 15),
    user: "Admin User",
    status: "info"
  },
  {
    id: 8,
    type: "report",
    title: "Citizen report resolved",
    description: "Infrastructure report #213 marked as resolved",
    timestamp: new Date(2023, 9, 9, 15, 42),
    status: "success"
  }
];

export default function RecentActivities() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activityType, setActivityType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter activities based on selected date and type
  const filteredActivities = activityData.filter(activity => {
    const sameDate = date ? 
      activity.timestamp.getDate() === date.getDate() && 
      activity.timestamp.getMonth() === date.getMonth() && 
      activity.timestamp.getFullYear() === date.getFullYear() 
      : true;
    
    const matchesType = activityType === "all" || activity.type === activityType;
    
    return sameDate && matchesType;
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "record":
        return <FileText className="h-4 w-4" />;
      case "anomaly":
        return <AlertCircle className="h-4 w-4" />;
      case "report":
        return <User className="h-4 w-4" />;
      case "verification":
        return <ArrowRight className="h-4 w-4" />;
      case "login":
        return <User className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 mb-1">Recent Activities</h1>
        <p className="text-neutral-600">Track all system activities and governance updates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="pb-3 border-b border-neutral-200">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Activity Timeline</CardTitle>
                <Tabs value={activityType} onValueChange={setActivityType}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="record">Records</TabsTrigger>
                    <TabsTrigger value="anomaly">Anomalies</TabsTrigger>
                    <TabsTrigger value="report">Reports</TabsTrigger>
                    <TabsTrigger value="verification">Verifications</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <div className="p-4">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <div key={i} className="flex gap-4 mb-6">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-2/3" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </div>
                    ))
                  ) : filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                      <div key={activity.id} className="mb-6 relative">
                        {/* Activity connector line */}
                        <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-neutral-200"></div>
                        
                        <div className="flex gap-4">
                          <div className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center ${getActivityStatusColor(activity.status)} text-white`}>
                            {getActivityIcon(activity.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-base font-medium text-neutral-900">{activity.title}</h3>
                                <p className="text-sm text-neutral-600 mt-1">{activity.description}</p>
                              </div>
                              <div className="text-xs text-neutral-500">{formatTime(activity.timestamp)}</div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {activity.user && (
                                <div className="flex items-center text-xs text-neutral-500">
                                  <Avatar className="h-5 w-5 mr-1">
                                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  {activity.user}
                                </div>
                              )}
                              
                              {activity.severity && (
                                <Badge variant={activity.severity === "high" ? "destructive" : "outline"}>
                                  {activity.severity} severity
                                </Badge>
                              )}
                              
                              {activity.hash && (
                                <Badge variant="outline" className="font-mono text-xs">
                                  {activity.hash}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-40">
                      <p className="text-neutral-500">No activities found for the selected date and filter</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="pb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-4 mt-4">
                <h3 className="text-sm font-medium">Activity Breakdown</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-neutral-100 rounded-md text-center">
                    <p className="text-2xl font-bold text-primary-700">
                      {activityData.filter(a => a.type === "record").length}
                    </p>
                    <p className="text-xs text-neutral-600">Records</p>
                  </div>
                  
                  <div className="p-3 bg-neutral-100 rounded-md text-center">
                    <p className="text-2xl font-bold text-amber-700">
                      {activityData.filter(a => a.type === "anomaly").length}
                    </p>
                    <p className="text-xs text-neutral-600">Anomalies</p>
                  </div>
                  
                  <div className="p-3 bg-neutral-100 rounded-md text-center">
                    <p className="text-2xl font-bold text-secondary-700">
                      {activityData.filter(a => a.type === "report").length}
                    </p>
                    <p className="text-xs text-neutral-600">Reports</p>
                  </div>
                  
                  <div className="p-3 bg-neutral-100 rounded-md text-center">
                    <p className="text-2xl font-bold text-blue-700">
                      {activityData.filter(a => a.type === "verification").length}
                    </p>
                    <p className="text-xs text-neutral-600">Verifications</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <h3 className="text-sm font-medium mb-3">Recent Updates</h3>
                  
                  <div className="space-y-3">
                    {activityData.slice(0, 3).map((activity) => (
                      <div key={`update-${activity.id}`} className="flex items-start gap-2">
                        <div className={`h-2 w-2 mt-1.5 rounded-full ${getActivityStatusColor(activity.status)}`}></div>
                        <div>
                          <p className="text-xs text-neutral-900">{activity.title}</p>
                          <p className="text-xs text-neutral-500">{formatTime(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
