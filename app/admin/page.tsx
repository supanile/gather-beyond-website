'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Menu, 
  X, 
  Bell, 
  Search,

  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

// Type definitions
interface MockStats {
  totalUsers: number
  totalOrders: number
  totalCommunity: number
  activeUsers: number
  growthRate: number
  ordersGrowth: number
  communityGrowth: number
  usersGrowth: number
}

// interface Order {
//   id: number
//   customer: string
//   amount: number
//   status: 'completed' | 'pending' | 'processing'
//   date: string
// }

// interface Product {
//   id: number
//   name: string
//   sales: number
//   revenue: number
//   image: string
// }

interface StatCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  growth?: number
  isPositive?: boolean
}

// interface OrderRowProps {
//   order: Order
// }

// interface ProductRowProps {
//   product: Product
// }

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

// Mock data
const mockStats: MockStats = {
  totalUsers: 12543,
  totalOrders: 8642,
  totalCommunity: 280,
  activeUsers: 3421,
  growthRate: 12.5,
  ordersGrowth: 8.2,
  communityGrowth: 15.3,
  usersGrowth: 6.8
}

// const mockRecentOrders: Order[] = [
//   { id: 1, customer: 'John Doe', amount: 2500, status: 'completed', date: '2024-01-15' },
//   { id: 2, customer: 'Jane Smith', amount: 1800, status: 'pending', date: '2024-01-14' },
//   { id: 3, customer: 'Mike Johnson', amount: 3200, status: 'processing', date: '2024-01-14' },
//   { id: 4, customer: 'Sarah Wilson', amount: 1200, status: 'completed', date: '2024-01-13' },
//   { id: 5, customer: 'Tom Brown', amount: 4500, status: 'pending', date: '2024-01-13' }
// ]

// const mockTopProducts: Product[] = [
//   { id: 1, name: 'iPhone 15 Pro', sales: 245, revenue: 245000, image: '📱' },
//   { id: 2, name: 'MacBook Air M2', sales: 189, revenue: 189000, image: '💻' },
//   { id: 3, name: 'AirPods Pro', sales: 324, revenue: 81000, image: '🎧' },
//   { id: 4, name: 'iPad Pro', sales: 156, revenue: 156000, image: '📱' },
//   { id: 5, name: 'Apple Watch', sales: 298, revenue: 119200, image: '⌚' }
// ]

const StatCard = ({ title, value, icon: Icon, growth, isPositive = true }: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-blue-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {growth && (
          <div className={`flex items-center mt-2 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            {growth}%
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${isPositive ? 'bg-blue-50' : 'bg-red-50'}`}>
        <Icon className={`w-6 h-6 ${isPositive ? 'text-blue-600' : 'text-red-600'}`} />
      </div>
    </div>
  </div>
)

// const OrderRow = ({ order }: OrderRowProps) => (
//   <div className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
//     <div className="flex items-center space-x-3">
//       <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
//         {order.customer.charAt(0)}
//       </div>
//       <div>
//         <p className="font-medium text-gray-900">{order.customer}</p>
//         <p className="text-sm text-gray-500">#{order.id}</p>
//       </div>
//     </div>
//     <div className="text-right">
//       <p className="font-medium text-gray-900">฿{order.amount.toLocaleString()}</p>
//       <p className="text-sm text-gray-500">{order.date}</p>
//     </div>
//     <div className="flex items-center space-x-2">
//       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//         order.status === 'completed' ? 'bg-green-100 text-green-800' :
//         order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//         'bg-blue-100 text-blue-800'
//       }`}>
//         {order.status}
//       </span>
//       <button className="p-1 hover:bg-gray-100 rounded">
//         <Eye className="w-4 h-4 text-gray-500" />
//       </button>
//     </div>
//   </div>
// )

// const ProductRow = ({ product }: ProductRowProps) => (
//   <div className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
//     <div className="flex items-center space-x-3">
//       <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
//         {product.image}
//       </div>
//       <div>
//         <p className="font-medium text-gray-900">{product.name}</p>
//         <p className="text-sm text-gray-500">{product.sales} sales</p>
//       </div>
//     </div>
//     <div className="text-right">
//       <p className="font-medium text-gray-900">฿{product.revenue.toLocaleString()}</p>
//       <p className="text-sm text-gray-500">Revenue</p>
//     </div>
//   </div>
// )

const Sidebar = ({ isOpen, onClose }: SidebarProps) => (
  <>
    {/* Mobile overlay */}
    {isOpen && (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
    )}
    
    {/* Sidebar */}
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Admin Panel
        </h2>
        <button onClick={onClose} className="lg:hidden">
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>
      <nav className="p-4">
        <div className="space-y-2">
          <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          {/* <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            <Users className="w-5 h-5" />
            <span>Users</span>
          </a> */}
          {/* <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            <ShoppingCart className="w-5 h-5" />
            <span>Orders</span>
          </a> */}
          {/* <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            <Package className="w-5 h-5" />
            <span>Products</span>
          </a> */}
          {/* <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            <Activity className="w-5 h-5" />
            <span>Analytics</span>
          </a> */}
          {/* <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </a> */}
        </div>
      </nav>
    </div>
  </>
)

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString('en-EN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={mockStats.totalUsers.toLocaleString()}
              icon={Users}
              // growth={mockStats.usersGrowth}
            />
            <StatCard
              title="Total Missions"
              value={mockStats.totalOrders.toLocaleString()}
              icon={ShoppingCart}
              // growth={mockStats.ordersGrowth}
            />
            <StatCard
              title="Total Community"
              value={`${mockStats.totalCommunity.toLocaleString()}`}
              icon={DollarSign}
              // growth={mockStats.communityGrowth}
            />
            {/* <StatCard
              title="Active Users"
              value={mockStats.activeUsers.toLocaleString()}
              icon={UserCheck}
              growth={mockStats.growthRate}
            /> */}
          </div>

          {/* Charts and Tables */}
          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> */}
            {/* Recent Orders */}
            {/* <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {mockRecentOrders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </div>
            </div> */}

            {/* Top Products */}
            {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {mockTopProducts.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div> */}

          {/* Quick Actions */}
          {/* <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <Plus className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Add New Product</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                <UserCheck className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Manage Users</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <Activity className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">View Analytics</span>
              </button>
              <button className="flex items-center space-x-3 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Settings</span>
              </button>
            </div>
          </div> */}
        </main>
      </div>
    </div>
  )
}

export default AdminPage