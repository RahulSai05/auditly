import React from "react";

const Dashboard = () => {
  return (
    <div className="flex-1 p-10">
      <h1 className="font-bold text-2xl mb-5">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-bold text-lg">Sales | Today</h2>
          <p className="text-3xl">145</p>
          <p className="text-green-500">12% increase</p>
        </div>
        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-bold text-lg">Revenue | This Month</h2>
          <p className="text-3xl">$3,264</p>
          <p className="text-green-500">8% increase</p>
        </div>
        <div className="bg-white p-5 rounded shadow">
          <h2 className="font-bold text-lg">Customers | This Year</h2>
          <p className="text-3xl">1244</p>
          <p className="text-red-500">12% decrease</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;