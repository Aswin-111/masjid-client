// components/Dashboard.jsx
"use client"; // Add this directive if using Next.js App Router
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Bars3Icon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  RectangleGroupIcon, // Placeholder for Total Masjids
  UsersIcon, // Placeholder for Total Members
  CogIcon, // Placeholder for Roles
  CalendarDaysIcon, // Placeholder for Events
  XMarkIcon, // For closing mobile menu
} from "@heroicons/react/24/outline"; // Using outline icons

import interceptor from "@/app/utils/admin.interceptor.js";
// Reusable Stat Card Component
const StatCard = ({
  icon: Icon,
  title,
  value,
  bgColorClass,
  iconColorClass,
}) => (
  <div className="flex items-center space-x-4 rounded-lg bg-white p-4 shadow">
    <div className={`rounded-full p-3 ${bgColorClass}`}>
      <Icon className={`h-6 w-6 ${iconColorClass}`} />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  </div>
);

// Main Dashboard Component
function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminData, setAdminData] = useState({});

  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    (async () => {
      const response = await interceptor.get(`${base_url}/admin/dashboard`);
      console.log(response);
      setAdminData(response.data.dashboard_data);
    })();
  }, []);
  // Placeholder data - replace with actual data fetching
  const stats = [
    // {
    //   title: "Total Masjids",
    //   value: adminData?.masjid_count || 0,
    //   icon: RectangleGroupIcon,
    //   bgColor: "bg-green-100",
    //   iconColor: "text-green-600",
    // },
    {
      title: "Total Members",
      value: adminData?.member_count || 0,
      icon: UsersIcon,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Roles",
      value: adminData?.role_count || 0,
      icon: CogIcon,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    {
      title: "Events",
      value: adminData?.event_count || 0,
      icon: CalendarDaysIcon,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const quickActions = [
    // {
    //   label: "Create New Masjid",
    //   color: "bg-green-600 hover:bg-green-700",
    //   path: "/admin/create-masjid",
    // },
    {
      label: "Add New Member",
      color: "bg-blue-600 hover:bg-blue-700",
      path: "/admin/create-member",
    },
    {
      label: "Create New Role",
      color: "bg-orange-500 hover:bg-orange-600",
      path: "/admin/create-role",
    },
    {
      label: "Edit member details",
      color: "bg-slate-600 hover:bg-purple-700",
      path: "/admin/edit-member",
    },
    // {
    //   label: "Edit role details",
    //   color: "bg-slate-600 hover:bg-purple-700",
    //   path: "/admin/create-event",
    // },
    // {
    //   label: "Create User Account",
    //   color: "bg-gray-700 hover:bg-gray-800",
    //   path: "/admin/create-user",
    // },
  ];
  function handleClick(path) {
    return router.push(path);
  }
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-10 bg-green-700 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side: Logo & Mobile Menu Button */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mr-2 rounded-md p-2 text-gray-200 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden" // Hidden on medium screens and up
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
              {/* Logo/Title */}
              <div className="flex-shrink-0">
                <span className="text-xl font-semibold">Masjid Management</span>
              </div>
            </div>

            {/* Right Side: Icons */}
            <div className="hidden md:block">
              {" "}
              {/* Hidden on small screens */}
              <div className="ml-4 flex items-center space-x-4 md:ml-6">
                <button className="rounded-full p-1 text-gray-200 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  className="flex items-center rounded-md p-1 px-3 text-gray-200 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700"
                  onClick={() => {
                    localStorage.removeItem("masjid_access_jwt_token");
                    router.push("/login");
                  }}
                >
                  <ArrowLeftOnRectangleIcon
                    className="mr-1 h-5 w-5"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {/* Mobile Nav links Placeholder - Add your actual links here */}
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600 hover:text-white"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600 hover:text-white"
              >
                Members
              </a>
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600 hover:text-white"
              >
                Events
              </a>
            </div>
            {/* Mobile Action Icons */}
            <div className="border-t border-green-600 pb-3 pt-4">
              <div className="flex items-center px-5">
                <button className="rounded-full p-1 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <button className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600 hover:text-white">
                  <ArrowLeftOnRectangleIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}

      <main className="flex-grow p-4 md:p-8">
        {/* Welcome Message */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Welcome, admin!
          </h1>
          <p className="text-gray-600">
            Here&apos;s an overview of your masjid management system.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              bgColorClass={stat.bgColor}
              iconColorClass={stat.iconColor}
            />
          ))}
        </div>

        {/* Main Content Grid (Recent Events & Quick Actions) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Recent Events Card */}
          <div className="rounded-lg bg-white p-6 shadow lg:col-span-3">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Recent Events
            </h2>
            <div className="text-center text-gray-500">
              <p>No events yet. Create your first event!</p>
              <a
                href="#"
                className="mt-2 inline-block text-sm text-green-600 hover:text-green-800"
              >
                Create Event
              </a>
            </div>
            {/* If events existed, you would map over them here */}
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-lg bg-white p-6 shadow lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleClick(action.path)}
                  className={`w-full rounded px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
