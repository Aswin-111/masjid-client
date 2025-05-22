// components/CreateUserAccountForm.jsx
"use client"; // Add this directive if using Next.js App Router

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import interceptor from "@/app/utils/superadmin.interceptor.js";
import toast, { Toaster } from "react-hot-toast";
import {
  Bars3Icon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  ArrowLeftIcon,
  XMarkIcon,
  InformationCircleIcon, // For the Note box
} from "@heroicons/react/24/outline"; // Using outline icons

function CreateUserAccountForm() {
  // State for the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    phone: "", // Pre-filled like image
    password: "", // Pre-filled like image
    confirmPassword: "",
    selectedMasjid: "",
  });
  const [masjids, setMasjids] = useState([]);
  // const [error, setError] = useState(""); // For password mismatch error

  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    (async () => {
      try {
        const response = await interceptor.get(
          `${base_url}/superadmin/addusermasjid`
        );
        console.log(response);
        setMasjids(response.data.details.masjid || []);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);
  // --- Placeholder Data ---

  // --- End Placeholder Data ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user types in password fields
    if (name === "password" || name === "confirmPassword") {
      // setError("");
    }
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      // Basic Validation: Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match.");
        return; // Stop submission
      }

      // Handle form submission logic here
      console.log("Submitting new user account:", {
        phone: formData.phone,
        // DO NOT log password in production, this is just for example
        // password: formData.password,
        selectedMasjid: formData.selectedMasjid,
      });

      const { phone, password, selectedMasjid } = formData;

      if (!phone || !password || !selectedMasjid) {
        toast.error("Please fill in all fields.");
        return;
      }
      const response = await interceptor.post(
        `${base_url}/superadmin/adduser`,
        {
          phone,
          password,
          masjid_id: selectedMasjid,
        }
      );
      console.log(response);

      toast.success(response.data.message);
      setTimeout(() => {
        router.push("/superadmin/dashboard");
      }, 2000);

      // Reset form or navigate away
      // setFormData({ email: '', password: '', confirmPassword: '', selectedMasjid: '' });
    } catch (error) {
      console.log(error);
      toast.error(error?.response.data.message);
    }
  };

  const handleCancel = () => {
    // Handle cancellation
    console.log("Form cancelled");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      selectedMasjid: "",
    });
    // setError("");
    // Add navigation logic if needed
  };

  // Function to render select options
  const renderOptions = (items, placeholder) => (
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

  // Define input style based on Login form's light background
  const inputStyle =
    "block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm";
  // Alternative light blue style: "block w-full rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-gray-900 placeholder-gray-500 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm";

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      {/* Top Navbar */}
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
            {/* Mobile menu content */}
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <a
                href="#"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600"
              >
                Dashboard
              </a>
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
            Create User Account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a new user with masjid-specific access
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Address */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="phone"
                  id="email"
                  maxLength={10}
                  required
                  autoComplete="email"
                  className={inputStyle} // Apply shared style
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  autoComplete="new-password"
                  className={inputStyle} // Apply shared style
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  required
                  autoComplete="new-password"
                  className={inputStyle} // Apply shared style
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {/* {error && <p className="mt-2 text-sm text-red-600">{error}</p>} */}
              </div>

              {/* Assign to Masjid Select */}
              <div>
                <label
                  htmlFor="selectedMasjid"
                  className="block text-sm font-medium text-gray-700"
                >
                  Assign to Masjid <span className="text-red-500">*</span>
                </label>
                <select
                  id="selectedMasjid"
                  name="selectedMasjid"
                  required
                  // Standard select style (not light blue)
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-black focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  value={formData.selectedMasjid}
                  onChange={handleChange}
                >
                  {renderOptions(masjids, "Select Assign to Masjid")}
                </select>
              </div>

              {/* Note Box */}
              <div className="rounded-md border border-yellow-300 bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon
                      className="h-5 w-5 text-yellow-400"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Note:</span> This user will
                      only have access to the selected masjid and its related
                      members and roles.
                    </p>
                  </div>
                </div>
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
                  Create User
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

export default CreateUserAccountForm;
