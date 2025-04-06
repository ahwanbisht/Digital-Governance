import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Anomaly } from "@shared/schema";

type AnomalyItem = {
  id: number;
  title: string;
  department: string;
  severity: string;
  detectedAt: string;
};

export function AnomalyDetection() {
  const { data, isLoading } = useQuery<{recentAnomalies: AnomalyItem[]}>({
    queryKey: ["/api/dashboard"],
  });

  // Format the time ago function
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
  };

  const renderAnomalies = () => {
    if (isLoading) {
      return [...Array(4)].map((_, i) => (
        <div key={i} className="p-3 border border-neutral-200 rounded-md">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-16 rounded" />
          </div>
          <div className="flex items-center mt-2">
            <Skeleton className="h-4 w-24 ml-5" />
          </div>
        </div>
      ));
    }

    const anomalies = data?.recentAnomalies || [];
    
    if (anomalies.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-neutral-500">No anomalies detected</p>
        </div>
      );
    }

    return anomalies.map((anomaly) => (
      <div key={anomaly.id} className="p-3 border border-neutral-200 rounded-md hover:bg-neutral-50 cursor-pointer">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-neutral-900">{anomaly.title}</p>
            <p className="text-xs text-neutral-500 mt-1">{anomaly.department}</p>
          </div>
          <Badge variant={anomaly.severity === "High" ? "destructive" : "warning"}>
            {anomaly.severity}
          </Badge>
        </div>
        <div className="flex items-center mt-2 text-xs text-neutral-500">
          <Clock className="h-4 w-4 mr-1" />
          Detected {formatTimeAgo(anomaly.detectedAt)}
        </div>
      </div>
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-neutral-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">AI Anomaly Detection</CardTitle>
          {!isLoading && data?.recentAnomalies && data.recentAnomalies.length > 0 && (
            <Badge variant="warning">
              {data.recentAnomalies.length} {data.recentAnomalies.length === 1 ? 'Anomaly' : 'Anomalies'}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-5">
        <div className="space-y-4">
          {renderAnomalies()}
        </div>
        
        <Button 
          variant="ghost"
          className="mt-4 text-primary-600 text-sm font-medium hover:text-primary-700 w-full"
        >
          View all anomalies
        </Button>
      </CardContent>
    </Card>
  );
}

export default AnomalyDetection;
