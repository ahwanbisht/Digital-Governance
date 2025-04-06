import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { PublicRecord } from "@shared/schema";

type StatusColor = {
  [key: string]: {
    bg: string;
    text: string;
  };
};

const statusColors: StatusColor = {
  "Verified": { bg: "bg-green-100", text: "text-green-800" },
  "Pending Review": { bg: "bg-yellow-100", text: "text-yellow-800" },
  "Flagged": { bg: "bg-red-100", text: "text-red-800" }
};

export function RecentPublicRecords() {
  const { data, isLoading } = useQuery<{recentRecords: PublicRecord[]}>({
    queryKey: ["/api/dashboard"],
  });

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-neutral-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Recent Public Records</CardTitle>
          <Button variant="ghost" className="text-primary-600 hover:text-primary-700">
            View All
          </Button>
        </div>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Record ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Skeleton className="h-5 w-10 ml-auto" />
                  </td>
                </tr>
              ))
            ) : (
              data?.recentRecords && data.recentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {record.recordId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {record.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {record.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {formatDate(record.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      statusColors[record.status]?.bg || "bg-neutral-100"
                    } ${
                      statusColors[record.status]?.text || "text-neutral-800"
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/public-records/${record.id}`} className="text-primary-600 hover:text-primary-700">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default RecentPublicRecords;
