import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { UploadIcon } from "lucide-react";
import { insertCitizenReportSchema } from "@shared/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const reportSchema = insertCitizenReportSchema.extend({
  reportType: z.string().min(1, "Please select a report type"),
  department: z.string().min(1, "Please select a department"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function CitizenReporting() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: "",
      department: "",
      description: "",
      isAnonymous: false,
      attachmentUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: ReportFormValues) => {
      const res = await apiRequest("POST", "/api/reports", values);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Your report has been submitted successfully.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit your report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: ReportFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b border-neutral-200">
        <CardTitle className="text-lg font-semibold">Citizen Reporting</CardTitle>
        <p className="text-sm text-neutral-500 mt-1">Submit anonymous reports or feedback</p>
      </CardHeader>
      
      <CardContent className="pt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Corruption Concern">Corruption Concern</SelectItem>
                      <SelectItem value="Service Feedback">Service Feedback</SelectItem>
                      <SelectItem value="Infrastructure Issue">Infrastructure Issue</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Related Department</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Public Works">Public Works</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Transportation">Transportation</SelectItem>
                      <SelectItem value="Urban Planning">Urban Planning</SelectItem>
                      <SelectItem value="Police">Police</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide details of your report or feedback..." 
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <Label htmlFor="attachment" className="block text-sm font-medium text-neutral-700 mb-1">
                Attachment (optional)
              </Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-neutral-400" />
                  <div className="flex text-sm text-neutral-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        disabled={form.formState.isSubmitting}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-neutral-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Submit Anonymously</FormLabel>
                    <p className="text-sm text-neutral-500">Your identity will be protected.</p>
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CitizenReporting;
