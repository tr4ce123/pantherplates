import React from 'react'

const Dashboard = () => {
  return (
    <div class="flex flex-col md:flex-row h-screen">
  <div class="bg-secondary text-secondary-foreground p-4 md:w-64">
    <h2 class="text-lg font-bold mb-4">FIU Dining</h2>
    <ul class="space-y-2">
      <li><a href="#" class="block hover:text-primary">Menu</a></li>
      <li><a href="#" class="block hover:text-primary">Order History</a></li>
      <li><a href="#" class="block hover:text-primary">Specials</a></li>
      <li><a href="#" class="block hover:text-primary">Settings</a></li>
    </ul>
  </div>

  <div class="flex-1 bg-white p-8">
    <h2 class="text-2xl font-bold mb-6">FIU Dining Dashboard</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-card p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-2">Today's Menu</h3>
        <p class="text-sm text-muted-foreground">Check out what's cooking today!</p>
        <button class="bg-primary text-primary-foreground hover:bg-primary/80 mt-4 p-2 rounded">View Menu</button>
      </div>

      <div class="bg-card p-4 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold mb-2">Recent Orders</h3>
        <p class="text-sm text-muted-foreground">Track your recent orders here.</p>
        <button class="bg-primary text-primary-foreground hover:bg-primary/80 mt-4 p-2 rounded">View Orders</button>
      </div>
    </div>

    <div class="mt-8">
      <h3 class="text-lg font-semibold mb-4">Statistics</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-card p-4 rounded-lg shadow-md">
          <h4 class="text-sm text-muted-foreground">Total Orders</h4>
          <p class="text-lg font-semibold mt-2">235</p>
        </div>

        <div class="bg-card p-4 rounded-lg shadow-md">
          <h4 class="text-sm text-muted-foreground">Revenue</h4>
          <p class="text-lg font-semibold mt-2">$4567</p>
        </div>

        <div class="bg-card p-4 rounded-lg shadow-md">
          <h4 class="text-sm text-muted-foreground">Most Popular Item</h4>
          <p class="text-lg font-semibold mt-2">Pizza</p>
        </div>
      </div>
    </div>
  </div>
</div>

  )
}

export default Dashboard

