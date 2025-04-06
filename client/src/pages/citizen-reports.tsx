import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MoreHorizontal, AlertCircle, CheckCircle, Clock, ChevronDown } from "lucide-react";
import CitizenReporting from "@/components/dashboard/citizen-reporting";
import { CitizenReport } from "@shared/schema";

export default function CitizenReports() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: reports, isLoading } = useQuery<CitizenReport[]>({
    queryKey: ["/api/reports"],
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReportIcon = (reportType: string) => {
    switch (reportType) {
      case "Corruption Concern":
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      case "Service Feedback":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "Infrastructure Issue":
        return <Clock className="h-8 w-8 text-amber-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-neutral-500" />;
    }
  };

  const filteredReports = reports ? reports.filter(report => {
    const matchesFilter = filter === "all" || report.status === filter;
    const matchesSearch = 
      report.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  }) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 mb-1">Citizen Reports</h1>
        <p className="text-neutral-600">Monitor and manage citizen feedback and reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3 border-b border-neutral-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="text-lg font-semibold">Reports & Feedback</CardTitle>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                    <Input 
                      type="text" 
                      placeholder="Search reports..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between items-center pt-2">
                          <Skeleton className="h-5 w-24" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredReports.length > 0 ? (
                <div className="divide-y divide-neutral-200">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="p-6 hover:bg-neutral-50">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {getReportIcon(report.reportType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-neutral-900">{report.reportType}</h3>
                              <p className="text-sm text-neutral-500">{report.department} Department</p>
                            </div>
                            {getStatusBadge(report.status)}
                          </div>
                          
                          <p className="mt-2 text-neutral-700">{report.description}</p>
                          
                          <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center text-sm text-neutral-500">
                              {report.isAnonymous ? (
                                <span>Submitted anonymously</span>
                              ) : (
                                <div className="flex items-center">
                                  <Avatar className="h-5 w-5 mr-1">
                                    <AvatarFallback>U</AvatarFallback>
                                  </Avatar>
                                  <span>User ID: {report.userId || "N/A"}</span>
                                </div>
                              )}
                              <span className="mx-2">•</span>
                              <span>{formatDate(report.createdAt)}</span>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Mark as In Progress</DropdownMenuItem>
                                <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                                <DropdownMenuItem>Reject Report</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-neutral-300 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900">No reports found</h3>
                  <p className="text-neutral-500 text-center mt-1 max-w-md">
                    There are no reports matching your current filter and search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Reports Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-neutral-100 rounded-lg p-4 text-center">
                  <p className="text-neutral-500 text-sm">Total Reports</p>
                  <p className="text-2xl font-bold text-neutral-900">{reports?.length || 0}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-yellow-600 text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-700">
                    {reports?.filter(r => r.status === "pending").length || 0}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-green-600 text-sm">Resolved</p>
                  <p className="text-2xl font-bold text-green-700">
                    {reports?.filter(r => r.status === "resolved").length || 0}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="department">
                <TabsList className="mb-4">
                  <TabsTrigger value="department">By Department</TabsTrigger>
                  <TabsTrigger value="type">By Type</TabsTrigger>
                  <TabsTrigger value="time">By Time</TabsTrigger>
                </TabsList>

                <TabsContent value="department">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Reports</TableHead>
                        <TableHead className="text-right">Pending</TableHead>
                        <TableHead className="text-right">Resolved</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Public Works</TableCell>
                        <TableCell className="text-right">12</TableCell>
                        <TableCell className="text-right">3</TableCell>
                        <TableCell className="text-right">9</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Education</TableCell>
                        <TableCell className="text-right">8</TableCell>
                        <TableCell className="text-right">2</TableCell>
                        <TableCell className="text-right">6</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Healthcare</TableCell>
                        <TableCell className="text-right">15</TableCell>
                        <TableCell className="text-right">5</TableCell>
                        <TableCell className="text-right">10</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="type">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Report Type</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Avg. Resolution Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Corruption Concern</TableCell>
                        <TableCell className="text-right">7</TableCell>
                        <TableCell className="text-right">5.2 days</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Service Feedback</TableCell>
                        <TableCell className="text-right">18</TableCell>
                        <TableCell className="text-right">2.1 days</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Infrastructure Issue</TableCell>
                        <TableCell className="text-right">10</TableCell>
                        <TableCell className="text-right">3.8 days</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="time">
                  <div className="flex items-center justify-center h-48">
                    <span className="text-neutral-500">Time-based analysis will be available in the next update</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div>
          <CitizenReporting />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Reporting Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Types of Reports</h3>
                <ul className="text-sm text-neutral-700 space-y-1">
                  <li className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span>Corruption Concerns - Report suspected corruption or misuse of funds</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>Service Feedback - Provide feedback about government services</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                    <span>Infrastructure Issues - Report problems with public infrastructure</span>
                  </li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Anonymity Protection</h3>
                <p className="text-sm text-neutral-700">
                  When submitting anonymously, your identity is protected by blockchain technology. We use zero-knowledge proofs to verify report authenticity without revealing your identity.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-neutral-900 mb-1">Report Processing</h3>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2 h-6 w-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">1</div>
                  <p className="text-sm text-neutral-700">Submission → AI Analysis → Department Assignment</p>
                </div>
                <div className="w-0.5 h-4 bg-neutral-200 ml-3"></div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2 h-6 w-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">2</div>
                  <p className="text-sm text-neutral-700">Investigation → Updates → Resolution</p>
                </div>
              </div>
              
              <Button className="w-full" variant="outline">
                <ChevronDown className="h-4 w-4 mr-2" />
                View Full Reporting Guidelines
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
