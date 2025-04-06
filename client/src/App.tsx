import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import MainLayout from "./layout/main-layout";
import Dashboard from "@/pages/dashboard";
import PublicRecords from "@/pages/public-records";
import Analytics from "@/pages/analytics";
import RecentActivities from "@/pages/recent-activities";
import CitizenReports from "@/pages/citizen-reports";
import BudgetTracking from "@/pages/budget-tracking";
import EventsMeetings from "@/pages/events-meetings";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/public-records" component={PublicRecords} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/recent-activities" component={RecentActivities} />
        <Route path="/citizen-reports" component={CitizenReports} />
        <Route path="/budget-tracking" component={BudgetTracking} />
        <Route path="/events-meetings" component={EventsMeetings} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
