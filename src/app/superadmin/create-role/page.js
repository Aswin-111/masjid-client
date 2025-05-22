// components/CreateRoleForm.jsx
"use client"; // Add this directive if using Next.js App Router

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  ArrowLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"; // Using outline icons
import toast, { Toaster } from "react-hot-toast";
import interceptor from "@/app/utils/superadmin.interceptor.js";

function CreateRoleForm() {
  // State for the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
    selectedMasjid: "",
  });
  const [masjids, setMasjids] = useState([]);

  const router = useRouter();

  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    (async () => {
      try {
        const response = await interceptor.get(
          `${base_url}/superadmin/addrolemasjid`
        );
        console.log(response);
        setMasjids(response.data.details.masjid || []);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  // --- Placeholder Data ---
  // Replace these with data fetched from your API (same as AddMemberForm example)
  // const masjids = [
  //   { id: "m1", name: "Central Masjid" },
  //   { id: "m2", name: "Masjid Al-Noor" },
  //   { id: "m3", name: "Uptown Mosque" },
  // ];
  // --- End Placeholder Data ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Submitting new role:", formData);
    const { roleName, description, selectedMasjid } = formData;

    if (!roleName || !description || !selectedMasjid) {
      toast.error("Please fill in all fields.");
      return;
    }
    const addrole_response = await interceptor.post(
      `${base_url}/superadmin/addrole`,
      {
        role_name: roleName,
        description,
        masjid_id: selectedMasjid,
      }
    );
    console.log(addrole_response);
    toast.success(addrole_response.data.message);
    setTimeout(() => {
      router.push("/superadmin/dashboard");
    }, 2000);

    // Reset form or navigate away
    // setFormData({ roleName: '', description: '', selectedMasjid: '' });
  };

  const handleCancel = () => {
    // Handle cancellation (e.g., navigate back or reset form)
    console.log("Form cancelled");
    setFormData({
      roleName: "",
      description: "",
      selectedMasjid: "",
    });
    // Add navigation logic if needed
  };

  // Function to render select options (reusable)
  const renderOptions = (items, placeholder) => {
    return (
      <>
        <option value="" disabled>
          {placeholder}
        </option>
        {items.map((item) => (
          <option key={item._id} value={item._id}>
            {item.masjid_name}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Top Navbar - Consistent with previous components */}
      <nav className="sticky top-0 z-10 bg-green-700 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mr-2 rounded-md p-2 text-gray-200 hover:bg-green-600 focus:outline-none md:hidden"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
              <span className="text-xl font-semibold">Masjid Management</span>
            </div>
            {/* Right Side */}
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4 md:ml-6">
                <button className="rounded-full p-1 text-gray-200 hover:bg-green-600 focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                </button>
                <button className="flex items-center rounded-md p-1 px-3 text-gray-200 hover:bg-green-600 focus:outline-none">
                  <ArrowLeftOnRectangleIcon className="mr-1 h-5 w-5" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600"
              >
                Dashboard
              </a>
              {/* Add other links */}
            </div>
            <div className="border-t border-green-600 pb-3 pt-4">
              <div className="flex items-center px-5">
                <button className="rounded-full p-1 text-gray-200 hover:text-white focus:outline-none">
                  <BellIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <button className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600">
                  <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5" /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-6">
          <button
            className="flex text-black mb-5 px-5 py-2 rounded-xl bg-slate-100 opacity-50"
            onClick={() => router.back()}
          >
            {" "}
            <ArrowLeftIcon className="h-5 w-5 " />{" "}
            <span className="px-3">Go back</span>
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create New Role
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Add a new role for a masjid
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Name */}
              <div>
                <label
                  htmlFor="roleName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="roleName"
                  id="roleName"
                  required
                  className="mt-1 block w-full h-10 rounded-md text-black border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={formData.roleName}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4} // Adjust rows as needed
                  className="mt-1 block w-full  rounded-md h-10 text-black border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Masjid Select */}
              <div>
                <label
                  htmlFor="selectedMasjid"
                  className="block text-sm font-medium text-gray-700"
                >
                  Masjid <span className="text-red-500">*</span>
                </label>
                <select
                  id="selectedMasjid"
                  name="selectedMasjid"
                  required
                  className="mt-1 block w-full rounded-md h-10 text-black border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  value={formData.selectedMasjid}
                  onChange={handleChange}
                >
                  {renderOptions(masjids, "Select Masjid")}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
        <Toaster />
      </main>
    </div>
  );
}

export default CreateRoleForm;
