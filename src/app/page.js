"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

// Define a unique placeholder for the "All Roles" option
const ALL_ROLES_PLACEHOLDER = "__ALL_ROLES__";

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [masjidData, setMasjidData] = useState([]);
  const [selectedMasjid, setSelectedMasjid] = useState(""); // Empty string for "All Masjids"
  const [filteredRoles, setFilteredRoles] = useState([]);
  // Initialize selectedRole with the placeholder for "All Roles"
  const [selectedRole, setSelectedRole] = useState(ALL_ROLES_PLACEHOLDER);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  // State for member details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMemberDetails, setSelectedMemberDetails] = useState(null); // Will hold member object or null
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Function to handle opening the details modal and fetching data
  const handleViewDetails = async (memberId) => {
    setIsDetailsModalOpen(true); // Open modal immediately
    setSelectedMemberDetails(null); // Clear previous details
    setIsLoadingDetails(true); // Show loading
    setDetailsError(null); // Clear previous errors

    const baseUrl = process.env.NEXT_PUBLIC_USER_BASE_URL;
    if (!baseUrl) {
      console.error("Error: NEXT_PUBLIC_USER_BASE_URL is not defined.");
      setDetailsError("Application configuration error: Base URL not defined.");
      setIsLoadingDetails(false);
      return;
    }

    try {
      // Assuming the backend endpoint accepts member ID as a query parameter
      const response = await axios.get(
        `${baseUrl}/getmemberdata?id=${memberId}`
      );
      setSelectedMemberDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch member details:", error);
      setDetailsError("Could not load member details. Please try again.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Function to close the details modal
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedMemberDetails(null);
    setDetailsError(null);
  };

  useEffect(() => {
    const fetchMasjidAndRoles = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_USER_BASE_URL;
        if (!baseUrl) {
          console.error("Error: NEXT_PUBLIC_USER_BASE_URL is not defined.");
          // Set a state to show an error message to the user if needed
          return;
        }
        const response = await axios.get(`${baseUrl}/getmasjidandroles`);

        const masjidList = response.data.masjid_data || [];
        setMasjidData(masjidList);

        // Flatten all members into a single list with masjid and role info
        const allMembers = masjidList
          .flatMap(
            (masjid) =>
              masjid.roles?.flatMap(
                (role) =>
                  role.members?.map((member) => ({
                    ...member, // Spreads all fields from the member object (e.g., _id, full_name, phone_number, etc.)
                    masjid_name: masjid.masjid_name,
                    role_name: role.role_name,
                    // role_id: role._id // Include if needed
                  })) || [] // Ensure inner map returns an array
              ) || [] // Ensure outer map returns an array
          )
          .filter(Boolean); // Remove any null/undefined entries

        setMembers(allMembers || []);
      } catch (error) {
        console.error("Failed to fetch masjid data:", error);
        // Consider setting an error state to display a message to the user
      }
    };

    fetchMasjidAndRoles();
  }, []);

  useEffect(() => {
    // If "All Masjids" is selected, clear filtered roles
    if (selectedMasjid === "") {
      setFilteredRoles([]);
      // Also reset selected role to "All Roles" when masjid changes to "All Masjids"
      setSelectedRole(ALL_ROLES_PLACEHOLDER);
      return;
    }
    const selectedMasjidObject = masjidData.find(
      (i) => i.masjid_name === selectedMasjid
    );
    // Reset selected role when a specific masjid is selected
    setSelectedRole(ALL_ROLES_PLACEHOLDER);
    setFilteredRoles(selectedMasjidObject?.roles || []);
  }, [selectedMasjid, masjidData]);

  // Filter members based on selectedMasjid, selectedRole, and searchTerm
  const filteredMembers = members.filter((member) => {
    const masjidMatch = selectedMasjid
      ? member.masjid_name === selectedMasjid
      : true;

    const roleMatch =
      selectedRole !== ALL_ROLES_PLACEHOLDER
        ? member.role_name === selectedRole
        : true;

    // Search functionality (case-insensitive search)
    const searchMatch = searchTerm
      ? member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.father_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.qualification?.toLowerCase().includes(searchTerm.toLowerCase())
      : true; // If searchTerm is empty, all members match the search

    return masjidMatch && roleMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6 font-inter">
      <div className="container mx-auto max-w-screen-lg px-4">
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Members Directory
            </h1>
          </div>
          {/* Add a button for creating a new member, perhaps? */}
          {/* <div>
             <button className="...">Add New Member</button>
          </div> */}
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-6 p-4 bg-white shadow rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            {/* Search Input */}
            <div className="md:col-span-2 lg:col-span-1">
              <label
                htmlFor="searchMembers"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Members
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="search"
                  id="searchMembers"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter Toggle Button */}
            <div className="lg:col-start-3 flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold border border-transparent rounded-lg shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 transition-colors"
                onClick={toggleFilter}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  ></path>
                </svg>
                {isFilterOpen ? "Hide" : "Show"} Filters
              </button>
            </div>
          </div>

          {isFilterOpen && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 pt-4">
              {/* Filter by Masjid */}
              <div>
                <label
                  htmlFor="filterByMasjid"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Filter by Masjid
                </label>
                <div className="relative">
                  <select
                    id="filterByMasjid"
                    value={selectedMasjid}
                    onChange={(e) => {
                      setSelectedMasjid(e.target.value);
                      // Role selection is reset in the useEffect dependency on selectedMasjid
                    }}
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-colors"
                  >
                    <option value="">All Masjids</option>
                    {masjidData.map((m) => (
                      <option key={m.masjid_id} value={m.masjid_name}>
                        {m.masjid_name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Filter by Role */}
              <div>
                <label
                  htmlFor="filterByRole"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Filter by Role
                </label>
                <div className="relative">
                  <select
                    id="filterByRole"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    // Disable if no masjid is selected, but still allow 'All Roles' if members are loaded (even without masjid filter)
                    disabled={
                      selectedMasjid !== "" && filteredRoles.length === 0
                    }
                    className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value={ALL_ROLES_PLACEHOLDER}>All Roles</option>
                    {/* Render filteredRoles if a specific masjid is selected, otherwise render nothing */}
                    {selectedMasjid !== "" &&
                      filteredRoles.map((role) => (
                        <option
                          key={role._id || role.role_name} // Use a unique key
                          value={role.role_name}
                        >
                          {role.role_name || "Unnamed Role"}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Member List */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMembers.map((member) => (
              // Assuming member._id is available and unique from the backend data after flattening
              <div
                key={member._id || member.phone_number} // Use a unique key, fallback to phone_number if _id isn't there
                className="bg-white border border-gray-200 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-200 ease-in-out flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.full_name || "N/A"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-0.5">
                    Father: {member.father_name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-0.5">
                    Phone: {member.phone_number || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600 mb-0.5">
                    Role:{" "}
                    <span className="font-medium text-blue-600">
                      {member.role_name || "N/A"}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Masjid:{" "}
                    <span className="font-medium text-green-600">
                      {member.masjid_name || "N/A"}
                    </span>
                  </p>
                  {/* Display other fields from the initial fetch if available (e.g., age, address, etc. might be included) */}
                  {/* These fields are expected to be guaranteed in the details modal but might not be in the initial list */}
                  {/* {member.age && <p className="text-sm text-gray-600 mb-0.5">Age: {member.age}</p>} */}
                  {/* {member.address && <p className="text-sm text-gray-600 mb-0.5">Address: {member.address}</p>} */}
                  {/* {member.occupation && <p className="text-sm text-gray-600 mb-0.5">Occupation: {member.occupation}</p>} */}
                  {/* {member.qualification && <p className="text-sm text-gray-600 mb-0.5">Qualification: {member.qualification}</p>} */}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                  {/* Call handleViewDetails with the member's unique ID */}
                  <button
                    onClick={() => handleViewDetails(member._id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-sm py-2 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-colors"
                    // Optionally disable while another detail fetch is ongoing, or if the current member's details are already being fetched/shown
                    disabled={
                      isLoadingDetails &&
                      selectedMemberDetails?._id !== member._id
                    }
                  >
                    {isLoadingDetails &&
                    selectedMemberDetails?._id === member._id
                      ? "Loading..."
                      : "View Details"}
                    {!isLoadingDetails &&
                      selectedMemberDetails?._id === member._id &&
                      "Viewing"}{" "}
                    {/* Optional: indicate if this member's details are already open */}
                    {/* {!isLoadingDetails && selectedMemberDetails?._id !== member._id && 'View Details'} */}
                  </button>
                  {/* <div className="flex gap-2">
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md p-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
                      title="Edit Member"
                    >
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
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                    </button>
                    <button
                      className="bg-red-100 hover:bg-red-200 text-red-700 rounded-md p-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
                      title="Delete Member"
                    >
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
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2zm3-12V5M6 5V3"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No members found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {isDetailsModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex justify-center items-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Member Details
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 rounded-lg p-1 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={handleCloseDetailsModal}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {isLoadingDetails && (
                <div className="text-center text-gray-500">
                  Loading details...
                </div>
              )}
              {detailsError && (
                <div className="text-center text-red-600">{detailsError}</div>
              )}
              {selectedMemberDetails && (
                <div className="text-gray-700">
                  <p>
                    <strong className="font-medium">Full Name:</strong>{" "}
                    {selectedMemberDetails.full_name || "N/A"}
                  </p>
                  <p>
                    <strong className="font-medium">Age:</strong>{" "}
                    {selectedMemberDetails.age || "N/A"}
                  </p>
                  <p>
                    <strong className="font-medium">Fathers Name:</strong>{" "}
                    {selectedMemberDetails.father_name || "N/A"}
                  </p>
                  <p>
                    <strong className="font-medium">Phone Number:</strong>{" "}
                    {selectedMemberDetails.phone_number || "N/A"}
                  </p>
                  <p>
                    <strong className="font-medium">Address:</strong>{" "}
                    {selectedMemberDetails.address || "N/A"}
                  </p>
                  <p>
                    <strong className="font-medium">Occupation:</strong>{" "}
                    {selectedMemberDetails.occupation || "N/A"}
                  </p>
                  <p>
                    <strong className="font-medium">Qualification:</strong>{" "}
                    {selectedMemberDetails.qualification || "N/A"}
                  </p>
                  {/* Display Role and Masjid names. We can get these from the flattened member object in the 'members' state */}
                  {/* as the details endpoint might not return them. Find the member in the original list by ID. */}
                  <p>
                    <strong className="font-medium">Role:</strong>{" "}
                    {members.find((m) => m._id === selectedMemberDetails._id)
                      ?.role_name ||
                      selectedMemberDetails.role_name ||
                      "N/A"}
                  </p>
                  <p>
                    <strong className="font-medium">Masjid:</strong>{" "}
                    {members.find((m) => m._id === selectedMemberDetails._id)
                      ?.masjid_name ||
                      selectedMemberDetails.masjid_name ||
                      "N/A"}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center p-5 border-t border-gray-200">
              <button
                onClick={handleCloseDetailsModal}
                type="button"
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
