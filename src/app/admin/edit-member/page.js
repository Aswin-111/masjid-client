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

// Separate component for the list view
function MemberCardList({ members, handleEdit, handleDeleteClick }) {
  const router = useRouter();
  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen">
      <button
        className="flex text-black mb-5 px-5 py-2 rounded-xl bg-slate-100 opacity-50"
        onClick={() => router.back()}
      >
        {" "}
        <ArrowLeftIcon className="h-5 w-5 " />{" "}
        <span className="px-3">Go back</span>
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        All Members
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.length > 0 ? (
          members.map((member) => (
            <div
              key={member._id}
              className="rounded-xl bg-white p-4 shadow-sm border border-gray-200"
            >
              <div className="w-full flex justify-between items-center">
                {/* Empty div to push delete button to the right */}
                <div></div>
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteClick(member._id)} // Pass member ID
                  className="bg-red-100 hover:bg-red-200 text-red-700 rounded-md p-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  title="Delete Member"
                >
                  <span className="sr-only">Delete member</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                {member.full_name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                📞 {member.phone_number}
              </p>
              <button
                onClick={() => handleEdit(member._id)}
                className="mt-2 inline-block rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
              >
                Edit
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No members found.
          </p>
        )}
      </div>
    </div>
  );
}

function AddMemberForm() {
  // State for the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State to control list view vs. edit form view
  const [isEditOpen, setEditOpen] = useState(false);

  // State for the member list
  const [members, setMembers] = useState([]);

  // State for editing a member
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [current_role_id, setCurrentRoleId] = useState(""); // To pre-select role dropdown

  // State for the edit form fields
  const [formData, setFormData] = useState({
    id: "",
    full_name: "",
    age: "",
    father_name: "",
    phone_number: "",
    address: "",
    occupation: "",
    qualification: "",
    role_id: "",
    // current_role: "", // This seems redundant, using role_id directly
  });

  // State for dropdown options (roles)
  const [addmemberdetails, setAddMemberDetails] = useState({
    // masjids: [], // commented out in original render
    roles: [],
  });

  // --- State for Delete Confirmation Popup ---
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDeleteId, setMemberToDeleteId] = useState(null);

  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Effect hook to fetch data based on view (list or edit)
  useEffect(() => {
    (async () => {
      try {
        if (!isEditOpen) {
          // Fetch all members for list view
          const response = await interceptor.get(
            `${base_url}/admin/editshowallmembers` // Endpoint name seems odd for "show all" but matches original code
          );
          setMembers(response.data.members || []);
        } else {
          // Fetch data for a specific member for edit view
          if (!editingMemberId) return; // Avoid fetching if no ID is set

          const response = await interceptor.get(
            `${base_url}/admin/geteditmemberdata/${editingMemberId}`
          );

          const {
            full_name,
            address,
            age,
            father_name,
            occupation,
            phone_number,
            qualification,
            role_id,
          } = response.data.member_data.member;
          console.log(response.data.member_data.member);

          // Set form data with fetched member details
          setFormData({
            id: response.data.member_data.member._id || "",
            full_name: full_name || "",
            address: address || "",
            age: age || "",
            father_name: father_name || "",
            occupation: occupation || "",
            phone_number: phone_number || "",
            qualification: qualification || "",
            role_id: role_id || "",
            // current_role: response.data.member_data.roles.find(i => i._id === role_id)?.role_name?.trim() || '', // Redundant
          });

          // Set available roles for the dropdown
          setAddMemberDetails({
            roles: [...response.data.member_data.roles] || [],
          });

          // Set current role ID for dropdown selection
          setCurrentRoleId(role_id);
        }
      } catch (error) {
        // toast.error(error?.response.data.message); // Uncomment for user feedback
        console.error("Error fetching data:", error);
        // Handle errors, maybe redirect or show a message
      }
    })();
  }, [isEditOpen, editingMemberId]); // Dependencies: re-run when view changes or editing member changes

  // Handler for clicking the "Edit" button on a member card
  const handleEdit = (id) => {
    setEditingMemberId(id);
    setEditOpen(true); // Switch to edit view
  };

  // Handler for clicking the delete icon on a member card
  const handleDeleteClick = (id) => {
    setMemberToDeleteId(id); // Store the ID of the member to delete
    setShowDeleteConfirm(true); // Show the confirmation popup
  };

  // Handler for canceling the delete action from the popup
  const cancelDelete = () => {
    setMemberToDeleteId(null); // Clear the stored ID
    setShowDeleteConfirm(false); // Hide the confirmation popup
  };

  // Handler for confirming the delete action from the popup
  const confirmDelete = async () => {
    if (!memberToDeleteId) return; // Should not happen if state is managed correctly

    try {
      // Perform the delete API call
      const response = await interceptor.delete(
        // Use DELETE method
        `${base_url}/admin/deletemember/${memberToDeleteId}`
      );

      toast.success(response.data.message || "Member deleted successfully!");

      // Update the members list in the state by filtering out the deleted member
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member._id !== memberToDeleteId)
      );

      // Close the popup and clear the ID
      cancelDelete();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error deleting member.");
      console.error("Error deleting member:", error);
      // Close the popup even on error, or handle error differently
      cancelDelete();
    }
  };

  // Handler for form field changes (used in edit form)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handler for submitting the edit form
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      // Destructure formData for validation and API call
      const {
        id,
        full_name,
        age,
        father_name,
        phone_number,
        address,
        occupation,
        qualification,
        role_id,
      } = formData;

      // Basic validation
      if (
        !full_name ||
        !age ||
        !father_name ||
        !phone_number ||
        !address ||
        !occupation ||
        !qualification ||
        !role_id // role_id is required
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // Make the API call to update the member
      const editmember_response = await interceptor.put(
        // Using PUT for update, adjust if backend expects POST
        `${base_url}/admin/editmember`,
        {
          id, // Send the member ID for identification
          full_name,
          age,
          father_name,
          phone_number,
          address,
          occupation,
          qualification,
          role_id,
        }
      );

      toast.success(editmember_response.data.message);

      // Optional: Navigate back to the list or refresh the single member's data in the list
      // setTimeout(() => {
      //   router.push("/admin/dashboard"); // Example navigation
      // }, 2000);
      // For simplicity here, we'll just stay on the edit page or manually go back
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong during edit."
      );
      console.error("Error submitting edit:", error);
    }
  };

  // Handler for canceling the edit form (resetting data and going back to list)
  const handleCancel = () => {
    console.log("Edit form cancelled");
    // Reset formData to initial empty state
    setFormData({
      id: "",
      full_name: "",
      age: "",
      father_name: "",
      phone_number: "",
      address: "",
      occupation: "",
      qualification: "",
      role_id: "",
    });
    setEditingMemberId(null); // Clear editing ID
    setEditOpen(false); // Go back to the list view
  };

  // Helper function to render role options (masjid options removed as they weren't used)
  const renderOptionsRole = (items, placeholder) => {
    return (
      <>
        <option value="" disabled>
          {placeholder}
        </option>
        {items.map((item) => (
          <option
            key={item._id}
            value={item._id}
            // Note: The 'selected' attribute is controlled by the 'value' on the <select> itself
            // selected={item._id === current_role_id} // This is less common in React controlled components
          >
            {item.role_name}
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
                {/* Add proper logout logic */}
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
                href="#" // Replace with actual link
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
                {/* Add proper logout logic */}
                <button className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-200 hover:bg-green-600">
                  <ArrowLeftOnRectangleIcon className="mr-2 h-5 w-5" /> Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area - Conditional Rendering */}
      {isEditOpen === false ? (
        // --- Member List View ---
        <MemberCardList
          members={members}
          handleEdit={handleEdit}
          handleDeleteClick={handleDeleteClick} // Pass the new handler
        />
      ) : (
        // --- Edit Member Form View ---
        <main className="flex-grow p-4 md:p-8">
          {/* Page Header */}
          <button
            type="button"
            onClick={handleCancel} // Use handleCancel to go back and reset form
            className="mb-4 rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
          >
            ← Back to Member List
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Edit Member
            </h1>
            <p className="mt-1 text-sm text-gray-600">Edit member data</p>
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
                      htmlFor="full_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      id="full_name"
                      required
                      className="mt-1 block w-full px-5 text-black h-10 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      value={formData.full_name}
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
                      type="number" // Use type number for age
                      name="age"
                      id="age"
                      required
                      className="mt-1 px-5 block h-10 text-black w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Father's Name */}
                  <div>
                    <label
                      htmlFor="father_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Father&apos;s Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="father_name"
                      id="father_name"
                      required
                      className="mt-1 px-5 block w-full text-black h-10 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      value={formData.father_name}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="phone_number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel" // Use type tel for phone number
                      name="phone_number"
                      id="phone_number"
                      required
                      className="mt-1 px-5 block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      value={formData.phone_number}
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
                      required
                      className="mt-1 px-5 block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      value={formData.address}
                      onChange={handleChange}
                    />
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
                      className="mt-1 px-5 block w-full text-black rounded-md h-10 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
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
                      className="mt-1 px-5 block w-full text-black rounded-md h-10 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      value={formData.qualification}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Role Select */}
                  <div>
                    <label
                      htmlFor="role_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role_id"
                      id="role_id"
                      required
                      value={formData.role_id} // Control the select value with state
                      onChange={handleChange}
                      className="mt-1 px-5 block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                    >
                      {renderOptionsRole(addmemberdetails.roles, "Select Role")}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-end space-x-3 border-t border-gray-200 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel} // Use handleCancel to go back
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* --- Delete Confirmation Popup --- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this member? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelDelete}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toaster for notifications */}
      <Toaster />
    </div>
  );
}

export default AddMemberForm;
