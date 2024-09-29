import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {

    const navigate = useNavigate();


  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Main Content */}
      <div className="flex-1 bg-white p-8">
        <h2 className="text-2xl font-bold mb-6">FIU Dining Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">View Meals</h3>
                <p className="text-sm text-muted-foreground">Check out what's cooking today!</p>
                <button
                onClick={() => navigate('/dashboard/meals')}
                className="bg-primary text-primary-foreground hover:bg-primary/80 mt-4 p-2 rounded">
                View Menu
                </button>
            </div>

          <div className="bg-card p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Create Meal</h3>
            <p className="text-sm text-muted-foreground">Track your recent orders here.</p>
            <button
            onClick={() => navigate('/dashboard/create')}
            className="bg-primary text-primary-foreground hover:bg-primary/80 mt-4 p-2 rounded">
              View Orders
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg shadow-md">
              <h4 className="text-sm text-muted-foreground">Total Orders</h4>
              <p className="text-lg font-semibold mt-2">235</p>
            </div>

            <div className="bg-card p-4 rounded-lg shadow-md">
              <h4 className="text-sm text-muted-foreground">Revenue</h4>
              <p className="text-lg font-semibold mt-2">$4567</p>
            </div>

            <div className="bg-card p-4 rounded-lg shadow-md">
              <h4 className="text-sm text-muted-foreground">Most Popular Item</h4>
              <p className="text-lg font-semibold mt-2">Pizza</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
