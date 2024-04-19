import React, { useState } from 'react';

import Sidebar from '../partials/Sidebar';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardCard04 from '../partials/dashboard/DashboardCard04';
import DashboardCard05 from '../partials/dashboard/DashboardCard05';
import DashboardCard06 from '../partials/dashboard/DashboardCard06';
import DashboardCard07 from '../partials/dashboard/DashboardCard07';
import DashboardCard08 from '../partials/dashboard/DashboardCard08';
import DashboardCard09 from '../partials/dashboard/DashboardCard09';
import DashboardCard11 from '../partials/dashboard/DashboardCard11';
import DashboardCard12 from '../partials/dashboard/DashboardCard12';
import DashboardCard13 from '../partials/dashboard/DashboardCard13';
import DashboardCardTruckDriverSalary from '../partials/dashboard/DashboardCardTruckDriverSalary';
import DashboardCardDelivery from '../partials/dashboard/DashboardCardDelivery';
import DashboardCardSafetyRecords from '../partials/dashboard/DashboardCardSafetyRecords';
import DashboardCardLoadTypes from '../partials/dashboard/DashboardCardLoadTypes';

function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Welcome banner */}
            <WelcomeBanner />

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {/* Bar chart (Truck Driver Salary Stats) */}
              <DashboardCardTruckDriverSalary />
              {/* Card (Recent Activity) */}
              <DashboardCardSafetyRecords />
              {/* Doughnut chart (Load Types) */}
              <DashboardCardLoadTypes />
              {/* Delivery VS. Customer Satisfaction */}
              <DashboardCardDelivery />
              {/* Line chart (Sales Over Time) */}
              <DashboardCard08 />
              {/* Line chart (Real Time Value) */}
              <DashboardCard05 />
              {/* Stacked bar chart (Sales VS Refunds) */}
              <DashboardCard09 />
              {/* Card (Reasons for Refunds) */}
              <DashboardCard11 />

              {/* Card (Income/Expenses) */}
              <DashboardCard13 />

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;