import { SidebarProps } from "@/types/admin/adminTypes";
import { BarChart3, X } from "lucide-react";

const AdminSidebar = ({ isOpen, onClose }: SidebarProps) => (
  <>
    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-59 z-40 lg:hidden"
        onClick={onClose}
      />
    )}
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
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
          <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium bg-blue-50 text-blue-700">
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>
      </nav>
    </div>
  </>
);

export default AdminSidebar;