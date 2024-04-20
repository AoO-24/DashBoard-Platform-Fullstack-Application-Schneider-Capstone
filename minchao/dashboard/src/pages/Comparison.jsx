import React, { useState } from 'react';

import Sidebar from '../partials/Sidebar.jsx';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner.jsx';
import DashboardComparison from '../partials/dashboard/DashboardComparison.jsx';
import C_DashboardCardTruckDriverSalary from '../partials/dashboard/C_DashboardCardTruckDriverSalary.jsx';

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
                <DashboardComparison />
                <C_DashboardCardTruckDriverSalary />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Comparison;