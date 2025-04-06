import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { verifyBlockchain } from "@/lib/blockchain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { InfoIcon } from "lucide-react";

type BlockchainService = {
  service: string;
  status: string;
  lastVerified: string;
  hash: string;
};

type BlockchainStatus = {
  allOperational: boolean;
  services: BlockchainService[];
};

export function BlockchainVerification() {
  const { toast } = useToast();
  
  const { data, isLoading, refetch } = useQuery<BlockchainStatus>({
    queryKey: ["/api/blockchain/status"],
  });

  // Function to format time ago
  const getTimeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return Math.floor(seconds) + " seconds ago";
  };

  // Function to manually verify blockchain status
  const handleVerify = async () => {
    try {
      await verifyBlockchain();
      toast({
        title: "Verification Successful",
        description: "All blockchain systems have been verified.",
        variant: "default",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify blockchain systems.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blockchain Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-neutral-900">Unable to load blockchain status</h3>
            <p className="text-sm text-neutral-600 mt-2">Please try again later</p>
            <Button className="mt-4" onClick={() => refetch()}>Retry</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-neutral-200">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Blockchain Verification Status</CardTitle>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            data.allOperational ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}>
            {data.allOperational ? "All Systems Operational" : "System Warning"}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data.services.map((service) => (
            <div key={service.service} className="p-4 border border-neutral-200 rounded-md">
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  service.status === "Operational" ? "bg-green-500" : "bg-yellow-500"
                }`}></div>
                <h3 className="text-sm font-medium">{service.service}</h3>
              </div>
              <p className="text-xs text-neutral-500">
                Last verified: {service.lastVerified ? getTimeAgo(service.lastVerified) : "Unknown"}
              </p>
              <p className="text-sm mt-2">Hash: {service.hash ? service.hash.substring(0, 6) + "..." + service.hash.substring(service.hash.length - 4) : "N/A"}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-neutral-50 rounded-md border border-neutral-200">
          <div className="flex items-start">
            <InfoIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-neutral-900">Blockchain verification ensures data integrity</h3>
              <p className="text-xs text-neutral-600 mt-1">
                All government records are immutably stored on the blockchain with timestamps and verification hashes. 
                This ensures transparency and prevents unauthorized modifications.
              </p>
              <Button 
                variant="link" 
                className="text-xs text-primary-600 font-medium hover:text-primary-700 mt-2 p-0 h-auto"
                onClick={handleVerify}
              >
                Manually verify blockchain status
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BlockchainVerification;
