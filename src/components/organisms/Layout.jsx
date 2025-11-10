import { Outlet } from "react-router-dom";
import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import React from "react";
import ApperIcon from "@/components/ApperIcon";

function Layout() {
  const { logout } = useAuth();
  const { user, isAuthenticated } = useSelector(state => state.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-green-50">
      {isAuthenticated && (
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Upload" size={16} className="text-white" />
                </div>
                <span className="font-bold text-gray-900">DropZone</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {user && (
                  <span className="text-sm text-gray-700">
                    Welcome, {user.firstName || user.emailAddress}
                  </span>
                )}
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="LogOut" size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;