import { Fragment } from "react";
import QuickStats from "@/components/dashboard/quick-stats";
import BudgetAllocationChart from "@/components/dashboard/budget-allocation-chart";
import AnomalyDetection from "@/components/dashboard/anomaly-detection";
import RecentPublicRecords from "@/components/dashboard/recent-public-records";
import CitizenReporting from "@/components/dashboard/citizen-reporting";
import BlockchainVerification from "@/components/ui/blockchain-verification";

export default function Dashboard() {
  return (
    <Fragment>
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-neutral-900 mb-1">Digital Governance Dashboard</h1>
        <p className="text-neutral-600">Promoting transparency, accountability, and citizen engagement</p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Allocation Chart */}
        <div className="col-span-2">
          <BudgetAllocationChart />
        </div>

        {/* Anomaly Detection */}
        <div>
          <AnomalyDetection />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Recent Public Records */}
        <div className="col-span-2">
          <RecentPublicRecords />
        </div>

        {/* Citizen Reporting */}
        <div>
          <CitizenReporting />
        </div>
      </div>

      {/* Blockchain Verification */}
      <div className="mt-6">
        <BlockchainVerification />
      </div>
    </Fragment>
  );
}
