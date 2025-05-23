"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bars3Icon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  ArrowLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import toast, { Toaster } from "react-hot-toast";
import interceptor from "@/app/utils/admin.interceptor.js";

export default function EditMasjidForm() {
  const router = useRouter();
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [masjids, setMasjids] = useState([]);
  const [selectedMasjid, setSelectedMasjid] = useState(null);
  const [formData, setFormData] = useState({
    masjid_name: "",
    address: "",
    phone_number: "",
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await interceptor.get(`${base_url}/superadmin/editmasjid`);
        setMasjids(res.data);
      } catch (err) {
        toast.error("Failed to load masjids");
      }
    })();
  }, []);

  const handleSelectMasjid = (masjid) => {
    setSelectedMasjid(masjid);
    setFormData({
      masjid_name: masjid.masjid_name,
      address: masjid.address,
      phone_number: masjid.phone_number,
    });
    setEditOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.masjid_name || !formData.address || !formData.phone_number) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const res = await interceptor.put(
        `${base_url}/superadmin/editmasjid/${selectedMasjid._id}`,
        formData
      );
      toast.success("Masjid updated successfully");
      setEditOpen(false);
      setSelectedMasjid(null);
      const updatedMasjids = await interceptor.get(
        `${base_url}/superadmin/editmasjid`
      );
      setMasjids(updatedMasjids.data);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await interceptor.delete(`${base_url}/superadmin/deletemasjid/${id}`);
      toast.success("Masjid deleted successfully");
      setMasjids(masjids.filter((m) => m._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <nav className="sticky top-0 z-10 bg-green-700 text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="mr-2 rounded-md p-2 text-gray-200 hover:bg-green-600 md:hidden"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
              <span className="text-xl font-semibold">Masjid Management</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center space-x-4">
                <BellIcon className="h-6 w-6" />
                <button
                  className="flex items-center rounded-md px-3 py-1 text-white hover:bg-green-600"
                  onClick={() => {
                    localStorage.removeItem("masjid_access_jwt_token");
                    router.push("/login");
                  }}
                >
                  <ArrowLeftOnRectangleIcon className="mr-1 h-5 w-5" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow p-4 md:p-8">
        {!isEditOpen ? (
          <div>
            <button
              className=" text-black flex gap-2 mb-5 cursor-pointer "
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Go back
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              All Masjids
            </h1>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {masjids.map((masjid) => (
                <div
                  key={masjid._id}
                  className="rounded-xl bg-white p-4 shadow-sm border border-gray-200"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    {masjid.masjid_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    📞 {masjid.phone_number}
                  </p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleSelectMasjid(masjid)}
                      className="mt-2 rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(masjid._id)}
                      className="mt-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setEditOpen(false)}
              className="mb-4 rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
            >
              ← Back to Masjid List
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Edit Masjid
            </h1>
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="px-4 py-5 sm:p-6 md:p-8">
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Masjid Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="masjid_name"
                      required
                      className="mt-1 block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      value={formData.masjid_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="mt-1 block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone_number"
                      required
                      className="mt-1 block w-full h-10 text-black rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-5">
                    <button
                      type="button"
                      onClick={() => setEditOpen(false)}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
                    >
                      Update Masjid
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        <Toaster />
      </main>
    </div>
  );
}
