// components/CreateEventForm.jsx
"use client"; // Add this directive if using Next.js App Router

import React, { useState } from "react";
import {
  Bars3Icon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  CalendarDaysIcon, // For Date Picker Icon
  PhotoIcon, // Placeholder for Upload button icon
} from "@heroicons/react/24/outline"; // Using outline icons

function CreateEventForm() {
  // State for the mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get today's date in YYYY-MM-DD format for default value
  // Note: This runs client-side. Ensure correct formatting.
  const today = new Date().toISOString().split("T")[0];

  // State for form fields
  const [formData, setFormData] = useState({
    eventTitle: "",
    description: "",
    eventDate: today, // Default to today
    selectedMasjid: "",
  });
  const [eventPosterFile, setEventPosterFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  // --- Placeholder Data ---
  const masjids = [
    { id: "m1", name: "Central Masjid" },
    { id: "m2", name: "Masjid Al-Noor" },
    { id: "m3", name: "Uptown Mosque" },
  ];
  // --- End Placeholder Data ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventPosterFile(file);
      setFileName(file.name);
    } else {
      setEventPosterFile(null);
      setFileName("No file chosen");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    // You'll likely need to use FormData to send the file
    const dataToSubmit = new FormData();
    dataToSubmit.append("eventTitle", formData.eventTitle);
    dataToSubmit.append("description", formData.description);
    dataToSubmit.append("eventDate", formData.eventDate);
    dataToSubmit.append("selectedMasjid", formData.selectedMasjid);
    if (eventPosterFile) {
      dataToSubmit.append("eventPoster", eventPosterFile);
    }

    console.log("Submitting new event (FormData):");
    // Log FormData entries (requires iterating)
    for (let [key, value] of dataToSubmit.entries()) {
      console.log(`${key}:`, value);
    }

    // Replace console logs with your actual API call using dataToSubmit
    // Example: axios.post('/api/events', dataToSubmit, { headers: { 'Content-Type': 'multipart/form-data' } });

    // Reset form or navigate away
    // setFormData({ eventTitle: '', description: '', eventDate: today, selectedMasjid: '' });
    // setEventPosterFile(null);
    // setFileName('No file chosen');
  };

  const handleCancel = () => {
    // Handle cancellation
    console.log("Form cancelled");
    setFormData({
      eventTitle: "",
      description: "",
      eventDate: today,
      selectedMasjid: "",
    });
    setEventPosterFile(null);
    setFileName("No file chosen");
    // Add navigation logic if needed
  };

  // Function to render select options
  const renderOptions = (items, placeholder) => (
    <>
      <option value="" disabled>
        {placeholder}
      </option>
      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </>
  );

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
          <h1 className="text-2xl font-semibold text-gray-900">
            Create New Event
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Add a new event for a masjid
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Title */}
              <div>
                <label
                  htmlFor="eventTitle"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="eventTitle"
                  id="eventTitle"
                  required
                  className="mt-1 block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={formData.eventTitle}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  required
                  className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              {/* Event Date */}
              <div>
                <label
                  htmlFor="eventDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Event Date <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1">
                  <input
                    type="date"
                    name="eventDate"
                    id="eventDate"
                    required
                    className="block w-full h-10 rounded-md text-black border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm pr-10" // Add padding for icon
                    value={formData.eventDate}
                    onChange={handleChange}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <CalendarDaysIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                </div>
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
                  className="mt-1 block w-full h-10 text-black rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  value={formData.selectedMasjid}
                  onChange={handleChange}
                >
                  {renderOptions(masjids, "Select Masjid")}
                </select>
              </div>

              {/* Event Poster */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Poster
                </label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="event-poster-upload"
                    className="cursor-pointer inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <PhotoIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    Upload Image
                  </label>
                  <input
                    id="event-poster-upload"
                    name="eventPoster"
                    type="file"
                    className="sr-only" // Hide the actual input
                    onChange={handleFileChange}
                    accept="image/*" // Suggest only image files
                  />
                  <span
                    className="text-sm text-gray-500 truncate"
                    title={fileName}
                  >
                    {fileName}
                  </span>
                </div>
                {eventPosterFile && (
                  <p className="mt-2 text-xs text-gray-500">
                    Preview logic can be added here if needed.
                  </p>
                )}
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
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateEventForm;
