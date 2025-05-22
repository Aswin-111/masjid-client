// components/CreateMasjidForm.jsx
"use client"; // Add this directive if using Next.js App Router

import React, { useState } from "react";
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

function CreateMasjidForm() {
  // State for the mobile menu (same as Dashboard)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for form fields
  const [masjidName, setMasjidName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      // Handle form submission logic here
      console.log("Submitting new masjid:", {
        masjidName,
        address,
        phoneNumber,
      });
      if (!masjidName || !address || !phoneNumber)
        return toast.error("All fields are required.");
      const create_masjid_response = await interceptor.post(
        `${base_url}/superadmin/createmasjid`,
        {
          masjid_name: masjidName,
          address,
          phone_number: phoneNumber,
        }
      );

      console.log(create_masjid_response);
      toast.success(create_masjid_response.data.message);
      setTimeout(() => {
        router.push("/superadmin/dashboard");
      }, 2000);
      // Replace console.log with your actual API call or state update
      // Optionally clear the form:
      // setMasjidName('');
      // setAddress('');
      // setPhoneNumber('');
    } catch (error) {
      console.log(error);
      toast.error(error?.response.data.message);
    }
  };

  const handleCancel = () => {
    // Handle cancellation logic (e.g., navigate back or reset form)
    console.log("Form cancelled");
    setMasjidName("");
    setAddress("");
    setPhoneNumber("");
    // Add navigation logic if needed (e.g., router.back())
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Top Navbar - Replicated from Dashboard for consistency */}
      <nav className="sticky top-0 z-10 bg-green-700 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Side: Logo & Mobile Menu Button */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mr-2 rounded-md p-2 text-gray-200 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
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
              <div className="ml-4 flex items-center space-x-4 md:ml-6">
                <button className="rounded-full p-1 text-gray-200 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <button className="flex items-center rounded-md p-1 px-3 text-gray-200 hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700">
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
            {/* Placeholder content - same as Dashboard */}
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600 hover:text-white"
              >
                Dashboard
              </a>
              {/* Add other relevant mobile links */}
            </div>
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
        {/* Page Header */}
        <div></div>
        <div className=" ">
          <button className="flex text-black mb-5 px-5 py-2 rounded-xl bg-slate-100 opacity-50" onClick={() => router.back()}>
            {" "}
            <ArrowLeftIcon className="h-5 w-5 " /> <span className="px-3">Go back</span>
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create New Masjid
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Add a new masjid to the system
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Masjid Name Field */}
              <div>
                <label
                  htmlFor="masjid-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Masjid Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="masjid-name"
                    id="masjid-name"
                    required
                    className="block  w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={masjidName}
                    onChange={(e) => setMasjidName(e.target.value)}
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text" // Consider using textarea if address can be long
                    name="address"
                    id="address"
                    required
                    className="block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {/* Example using textarea instead:
                                    <textarea
                                        id="address"
                                        name="address"
                                        rows={3}
                                        required
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter the full address"
                                    />
                                    */}
                </div>
              </div>

              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="phone-number"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="tel" // Use type="tel" for phone numbers
                    name="phone-number"
                    id="phone-number"
                    required
                    className="block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-5">
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
                  Create Masjid
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

export default CreateMasjidForm;
