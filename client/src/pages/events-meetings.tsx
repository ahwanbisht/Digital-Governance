import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Video, ChevronRight, Download, ExternalLink } from "lucide-react";

// Mock data for government events and meetings
const events = [
  {
    id: 1,
    title: "City Council Meeting",
    date: new Date(2023, 9, 15, 10, 0),
    endTime: new Date(2023, 9, 15, 12, 0),
    location: "City Hall - Main Chamber",
    department: "City Council",
    type: "meeting",
    description: "Regular city council meeting to discuss budget allocations and civic improvements.",
    attendees: 15,
    documents: ["Agenda", "Budget Proposal", "Previous Minutes"],
    status: "upcoming"
  },
  {
    id: 2,
    title: "Public Hearing: Downtown Development",
    date: new Date(2023, 9, 17, 14, 30),
    endTime: new Date(2023, 9, 17, 16, 30),
    location: "Virtual Meeting",
    department: "Urban Planning",
    type: "hearing",
    description: "Public hearing regarding the proposed downtown development project.",
    attendees: 28,
    documents: ["Project Overview", "Environmental Impact", "Public Comments"],
    status: "upcoming"
  },
  {
    id: 3,
    title: "Education Committee",
    date: new Date(2023, 9, 12, 9, 0),
    endTime: new Date(2023, 9, 12, 11, 0),
    location: "Education Department - Room 302",
    department: "Education",
    type: "committee",
    description: "Monthly committee meeting to discuss educational policies and initiatives.",
    attendees: 8,
    documents: ["Agenda", "School Performance Report", "Budget Update"],
    status: "completed",
    recording: "https://example.com/recordings/education-committee-oct12"
  },
  {
    id: 4,
    title: "Healthcare Budget Review",
    date: new Date(2023, 9, 20, 13, 0),
    endTime: new Date(2023, 9, 20, 15, 0),
    location: "Health Department Conference Room",
    department: "Healthcare",
    type: "budget",
    description: "Quarterly review of healthcare budget allocation and spending.",
    attendees: 12,
    documents: ["Budget Report", "Spending Analysis", "Proposed Adjustments"],
    status: "upcoming"
  },
  {
    id: 5,
    title: "Transportation Infrastructure Planning",
    date: new Date(2023, 9, 18, 11, 0),
    endTime: new Date(2023, 9, 18, 13, 30),
    location: "City Hall - Room 105",
    department: "Transportation",
    type: "planning",
    description: "Planning meeting for upcoming transportation infrastructure projects.",
    attendees: 10,
    documents: ["Project List", "Timeline", "Budget Allocation"],
    status: "upcoming"
  },
  {
    id: 6,
    title: "Public Safety Committee",
    date: new Date(2023, 9, 10, 14, 0),
    endTime: new Date(2023, 9, 10, 16, 0),
    location: "Police Headquarters - Conference Room",
    department: "Public Safety",
    type: "committee",
    description: "Regular meeting of the public safety committee to discuss community initiatives.",
    attendees: 9,
    documents: ["Agenda", "Crime Statistics", "Community Feedback"],
    status: "completed",
    recording: "https://example.com/recordings/public-safety-oct10"
  }
];

export default function EventsMeetings() {
  const [date, setDate] = useState<Date>(new Date());
  const [filter, setFilter] = useState("all");
  const [department, setDepartment] = useState("all");
  
  // Filter events based on date, status, and department
  const filteredEvents = events.filter(event => {
    const matchesDate = isSameDay(event.date, date);
    const matchesStatus = filter === "all" || event.status === filter;
    const matchesDepartment = department === "all" || event.department === department;
    
    return matchesDate && matchesStatus && matchesDepartment;
  });
  
  // Get events for today
  const todayEvents = events.filter(event => 
    isSameDay(event.date, new Date()) &&
    (department === "all" || event.department === department)
  );
  
  // Get upcoming events
  const upcomingEvents = events.filter(event => 
    event.date > new Date() &&
    (department === "all" || event.department === department)
  ).sort((a, b) => a.date.getTime() - b.date.getTime());
  
  // Format time for display
  const formatEventTime = (start: Date, end: Date) => {
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };
  
  // Get badge color based on event type
  const getEventBadge = (type: string) => {
    switch (type) {
      case "meeting":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Meeting</Badge>;
      case "hearing":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Hearing</Badge>;
      case "committee":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Committee</Badge>;
      case "budget":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Budget</Badge>;
      case "planning":
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-200">Planning</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 mb-1">Events & Meetings</h1>
        <p className="text-neutral-600">Track all government meetings, hearings, and public events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b border-neutral-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-lg font-semibold">Event Calendar</CardTitle>
              
              <div className="flex gap-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="City Council">City Council</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Urban Planning">Urban Planning</SelectItem>
                    <SelectItem value="Public Safety">Public Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-4 border-r border-neutral-200">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  className="rounded-md border"
                />
              </div>

              <div className="p-4">
                <div className="flex items-center mb-4">
                  <h3 className="font-medium text-base">{format(date, "MMMM d, yyyy")}</h3>
                  <Badge variant="outline" className="ml-2">
                    {filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}
                  </Badge>
                </div>
                
                <ScrollArea className="h-64 pr-4">
                  {filteredEvents.length > 0 ? (
                    <div className="space-y-4">
                      {filteredEvents.map((event) => (
                        <div key={event.id} className="p-3 border border-neutral-200 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-neutral-900">{event.title}</h4>
                              <p className="text-xs text-neutral-500 mt-1">{event.department}</p>
                            </div>
                            {getEventBadge(event.type)}
                          </div>
                          
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-xs text-neutral-600">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatEventTime(event.date, event.endTime)}
                            </div>
                            <div className="flex items-center text-xs text-neutral-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-500">
                      <Calendar className="h-12 w-12 mb-2 text-neutral-300" />
                      <p>No events scheduled for this date</p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Today's Events</CardTitle>
          </CardHeader>
          <CardContent>
            {todayEvents.length > 0 ? (
              <div className="space-y-4">
                {todayEvents.map((event) => (
                  <div key={`today-${event.id}`} className="p-3 border border-neutral-200 rounded-md hover:bg-neutral-50 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-neutral-900">{event.title}</h4>
                      {getEventBadge(event.type)}
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">{event.department}</p>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-xs text-neutral-600">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatEventTime(event.date, event.endTime)}
                      </div>
                      <div className="flex items-center text-xs text-neutral-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                    
                    <Button className="w-full mt-3" size="sm">
                      {event.location.toLowerCase().includes("virtual") ? (
                        <>
                          <Video className="h-3 w-3 mr-1" />
                          Join Meeting
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-3 w-3 mr-1" />
                          View Details
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-neutral-500">
                <Calendar className="h-12 w-12 mb-2 text-neutral-300" />
                <p>No events scheduled for today</p>
              </div>
            )}
            
            <Separator className="my-4" />
            
            <h3 className="font-medium text-neutral-900 mb-3">Upcoming Events</h3>
            
            {upcomingEvents.length > 0 ? (
              <div className="space-y-2">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div key={`upcoming-${event.id}`} className="flex justify-between items-center p-2 hover:bg-neutral-50 rounded-md cursor-pointer">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">{event.title}</h4>
                      <p className="text-xs text-neutral-500">{format(event.date, "MMM d, h:mm a")}</p>
                    </div>
                    {getEventBadge(event.type)}
                  </div>
                ))}
                
                {upcomingEvents.length > 3 && (
                  <Button variant="ghost" className="w-full text-sm mt-2">
                    View all {upcomingEvents.length} upcoming events
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-center text-neutral-500 text-sm">No upcoming events</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader className="pb-3 border-b border-neutral-200">
            <Tabs defaultValue="upcoming">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold">Event Details</CardTitle>
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past Events</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-0">
            <TabsContent value="upcoming" className="m-0">
              <div className="divide-y divide-neutral-200">
                {events.filter(e => e.status === "upcoming").map((event) => (
                  <div key={`detail-${event.id}`} className="p-6 hover:bg-neutral-50">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="bg-neutral-100 rounded-md p-4 text-center md:w-48 flex-shrink-0">
                        <p className="text-lg font-bold text-neutral-900">{format(event.date, "MMMM")}</p>
                        <p className="text-3xl font-bold text-primary-600">{format(event.date, "d")}</p>
                        <p className="text-neutral-600">{format(event.date, "EEEE")}</p>
                        <div className="mt-2 pt-2 border-t border-neutral-200 text-sm text-neutral-500">
                          {format(event.date, "h:mm a")}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-medium text-neutral-900">{event.title}</h3>
                            <p className="text-neutral-500">{event.department}</p>
                          </div>
                          {getEventBadge(event.type)}
                        </div>
                        
                        <p className="mt-3 text-neutral-700">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center text-sm text-neutral-600">
                            <Clock className="h-4 w-4 mr-2 text-neutral-400" />
                            {formatEventTime(event.date, event.endTime)}
                          </div>
                          
                          <div className="flex items-center text-sm text-neutral-600">
                            <MapPin className="h-4 w-4 mr-2 text-neutral-400" />
                            {event.location}
                          </div>
                          
                          <div className="flex items-center text-sm text-neutral-600">
                            <Users className="h-4 w-4 mr-2 text-neutral-400" />
                            {event.attendees} Attendees
                          </div>
                          
                          <div className="flex items-center text-sm text-neutral-600">
                            <Download className="h-4 w-4 mr-2 text-neutral-400" />
                            {event.documents.length} Documents
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          {event.documents.map((doc, idx) => (
                            <Badge key={idx} variant="secondary" className="flex items-center">
                              {doc}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                          {event.location.toLowerCase().includes("virtual") ? (
                            <Button>
                              <Video className="h-4 w-4 mr-2" />
                              Join Virtual Meeting
                            </Button>
                          ) : (
                            <Button>
                              <Calendar className="h-4 w-4 mr-2" />
                              Add to Calendar
                            </Button>
                          )}
                          <Button variant="outline">View Full Details</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="past" className="m-0">
              <div className="divide-y divide-neutral-200">
                {events.filter(e => e.status === "completed").map((event) => (
                  <div key={`past-${event.id}`} className="p-6 hover:bg-neutral-50">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="bg-neutral-100 rounded-md p-4 text-center md:w-48 flex-shrink-0">
                        <p className="text-lg font-bold text-neutral-900">{format(event.date, "MMMM")}</p>
                        <p className="text-3xl font-bold text-neutral-600">{format(event.date, "d")}</p>
                        <p className="text-neutral-600">{format(event.date, "EEEE")}</p>
                        <div className="mt-2 pt-2 border-t border-neutral-200 text-sm text-neutral-500">
                          {format(event.date, "h:mm a")}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-medium text-neutral-900">{event.title}</h3>
                            <p className="text-neutral-500">{event.department}</p>
                          </div>
                          <Badge variant="outline">Completed</Badge>
                        </div>
                        
                        <p className="mt-3 text-neutral-700">{event.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="flex items-center text-sm text-neutral-600">
                            <Clock className="h-4 w-4 mr-2 text-neutral-400" />
                            {formatEventTime(event.date, event.endTime)}
                          </div>
                          
                          <div className="flex items-center text-sm text-neutral-600">
                            <MapPin className="h-4 w-4 mr-2 text-neutral-400" />
                            {event.location}
                          </div>
                          
                          <div className="flex items-center text-sm text-neutral-600">
                            <Users className="h-4 w-4 mr-2 text-neutral-400" />
                            {event.attendees} Attendees
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <Button variant="secondary">
                            <Video className="h-4 w-4 mr-2" />
                            View Recording
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {events.flatMap(event => 
                  event.documents.map((doc, idx) => ({
                    id: `${event.id}-${idx}`,
                    title: doc,
                    eventTitle: event.title,
                    date: event.date,
                    department: event.department
                  }))
                ).map(doc => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-neutral-100 p-6 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-neutral-900 truncate">{doc.title}</h3>
                        <p className="text-xs text-neutral-500 mt-1">{doc.eventTitle}</p>
                        <p className="text-xs text-neutral-500">{format(doc.date, "MMM d, yyyy")}</p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
