import React, { useState } from 'react';

import Sidebar from '../partials/Sidebar.jsx';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner.jsx';
import C_DashboardCardTruckDriverSalary from '../partials/dashboard/C_DashboardCardTruckDriverSalary.jsx';
import DashboardCardSafetyRecords from '../partials/dashboard/C_DashboardCardSafetyRecords.jsx';
import DashboardCardDelivery from '../partials/dashboard/C_DashboardCardDelivery.jsx';
import DashboardCardFuelConsumption from '../partials/dashboard/C_DashboardCardFuelConsumption.jsx';
import DashboardCardTimeAdherence from '../partials/dashboard/C_DashboardCardTimeAdherence.jsx';
import DashboardCardLoadTypes from '../partials/dashboard/C_DashboardCardLoadTypes.jsx';
import DashboardCardVehicleHealth from '../partials/dashboard/C_DashboardCardVehicleHealth.jsx';
import DashboardCardWorkHours from '../partials/dashboard/C_DashboardCardWorkHours.jsx';


function Comparison() {

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
            <div className="flex w-full">
              <div className="ml-4 flex-grow">
                {/* <DashboardComparison /> */}
                <C_DashboardCardTruckDriverSalary />
                <DashboardCardSafetyRecords />
                <DashboardCardLoadTypes />
                <DashboardCardWorkHours />
                <DashboardCardDelivery />
                <DashboardCardFuelConsumption />
                <DashboardCardTimeAdherence />
                {/* <DashboardCardVehicleHealth /> */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Comparison;