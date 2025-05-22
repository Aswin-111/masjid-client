// components/AddMemberForm.jsx
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
import interceptor from "../../utils/admin.interceptor.js";

function AddMemberForm() {
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  // State for the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for form fields
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    fatherName: "",
    phoneNumber: "",
    address: "",
    occupation: "",
    qualification: "",
    selectedRole: "",
  });
  const [addmemberdetails, setAddMemberDetails] = useState({
    masjids: [],
    roles: [],
  });

  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const response = await interceptor.get(
          `${base_url}/admin/addmemberdetails`
        );
        console.log(response);
        setAddMemberDetails({
          roles: response.data.member_data.roles || [],
        });
      } catch (error) {
        toast.error(error?.response.data.message);
        console.log(error);
      }
    })();
  }, []);
  // --- Placeholder Data ---
  // Replace these with data fetched from your API
  // const masjids = [
  //   { id: "m1", name: "Central Masjid" },
  //   { id: "m2", name: "Masjid Al-Noor" },
  //   { id: "m3", name: "Uptown Mosque" },
  // ];
  // const roles = [
  //   { id: "r1", name: "Member" },
  //   { id: "r2", name: "Volunteer" },
  //   { id: "r3", name: "Committee Member" },
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
    try {
      event.preventDefault();
      // Handle form submission logic here
      console.log("Submitting new member:", formData);
      const {
        fullName,
        age,
        fatherName,
        phoneNumber,
        address,
        occupation,
        qualification,

        selectedRole,
      } = formData;

      if (
        !fullName ||
        !age ||
        !fatherName ||
        !phoneNumber ||
        !address ||
        !occupation ||
        !qualification ||
        !selectedRole
      ) {
        toast.error("Please fill in all fields.");
        return;
      }
      const addmember_response = await interceptor.post(
        `${base_url}/admin/addmember`,
        {
          full_name: fullName,
          age,
          father_name: fatherName,
          phone_number: phoneNumber,
          address,
          occupation,
          qualification,
          role_id: selectedRole,
        }
      );

      console.log(addmember_response);
      toast.success(addmember_response.data.message);
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);

      // Reset form or navigate away
      // setFormData({ /* initial state */ });
    } catch (error) {
      toast.error(error?.response.data.message);
      console.log(error);
    }
  };

  const handleCancel = () => {
    // Handle cancellation (e.g., navigate back or reset form)
    console.log("Form cancelled");
    setFormData({
      fullName: "",
      age: "",
      fatherName: "",
      phoneNumber: "",
      address: "",
      occupation: "",
      qualification: "",
      selectedMasjid: "",
      selectedRole: "",
    });
    // Add navigation logic if needed
  };

  // Function to render select options
  const renderOptionsMasjid = (items, placeholder) => (
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
  const renderOptionsRole = (items, placeholder) => (
    <>
      <option value="" disabled>
        {placeholder}
      </option>
      {items.map((item) => (
        <option key={item._id} value={item._id}>
          {item.role_name}
        </option>
      ))}
    </>
  );
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
            Add New Member
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Create a new member in the system
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              {/* Responsive Grid for Form Fields */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    className="mt-1 block w-full text-black h-10 rounded-md  border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                {/* Age */}
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    id="age"
                    required
                    className="mt-1 block h-10 text-black w-full rounded-md  border-gray-300  shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={formData.age}
                    onChange={handleChange}
                  />
                </div>

                {/* Father's Name */}
                <div>
                  <label
                    htmlFor="fatherName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Father&apos;s Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    id="fatherName"
                    required
                    className="mt-1 block w-full text-black h-10 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    required
                    className="mt-1 block w-full  h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                {/* Address - Spanning full width */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    required // Or use textarea
                    className="mt-1 block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {/* <textarea name="address" id="address" rows={3} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm" value={formData.address} onChange={handleChange}></textarea> */}
                </div>

                {/* Occupation */}
                <div>
                  <label
                    htmlFor="occupation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    id="occupation"
                    className="mt-1 block w-full text-black rounded-md h-10 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={formData.occupation}
                    onChange={handleChange}
                  />
                </div>

                {/* Qualification */}
                <div>
                  <label
                    htmlFor="qualification"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    id="qualification"
                    className="mt-1 block w-full text-black rounded-md h-10 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    value={formData.qualification}
                    onChange={handleChange}
                  />
                </div>

                {/* Masjid Select */}
                {/* <div>
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
                    className="mt-1 block w-full rounded-md text-black border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                    value={formData.selectedMasjid}
                    onChange={handleChange}
                  >
                    {renderOptionsMasjid(
                      addmemberdetails?.masjids,
                      "Select Masjid"
                    )}
                  </select>
                </div> */}

                {/* Role Select */}
                <div>
                  <label
                    htmlFor="selectedRole"
                    className="block text-sm font-medium text-black"
                  >
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="selectedRole"
                    name="selectedRole"
                    required
                    className="mt-1 block w-full rounded-md text-black py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                    value={formData.selectedRole}
                    onChange={handleChange}
                  >
                    {renderOptionsRole(addmemberdetails?.roles, "Select Role")}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
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
                  Create Member
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

export default AddMemberForm;
