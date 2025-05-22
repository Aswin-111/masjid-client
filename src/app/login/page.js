// components/Login.jsx
"use client"; // Add this directive if using Next.js App Router

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { jwtDecode } from "jwt-decode";
// Placeholder Mosque/Building Icon SVG component
const MosqueIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props} // Allows passing className, size etc.
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
    />
  </svg>
);

function Login() {
  const [phone, setPhone] = useState(""); // Pre-filled like image
  const [password, setPassword] = useState(""); // Pre-filled like image
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("masjid_access_jwt_token");
    if (token) {
      const decoded = jwtDecode(token);
      if (decoded.role === "superadmin") {
        router.push("/superadmin/dashboard");
      } else {
        router.push("/admin/dashboard");
      }
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Handle login logic here
      console.log(
        process.env.NEXT_PUBLIC_API_BASE_URL,
        "process.env.NEXT_PUBLIC_API_BASE_URL env"
      );
      const login_response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          phone,
          password,
        }
      );
      console.log(login_response);

      if (login_response.status === 200) {
        console.log(login_response.data);
        toast.success(login_response.data?.message);
        localStorage.setItem(
          "masjid_access_jwt_token",
          login_response.data.token
        );
        setTimeout(() => {
          if (login_response.data.role === "superadmin") {
            router.push("/superadmin/dashboard");
          } else {
            router.push("/admin/dashboard");
          }
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response.data.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        {/* Header Section */}
        <div className="text-center">
          <MosqueIcon className="mx-auto h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Masjid Management
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </span>
              <input
                name="phone"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 bg-blue-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 bg-blue-50 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Sign In Button */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="flex items-center justify-center space-x-2">
          <span className="h-px flex-1 bg-gray-300"></span>
          <span className="text-sm text-gray-500">Or</span>
          <span className="h-px flex-1 bg-gray-300"></span>
        </div>

        {/* Create Account Button/Link */}
        <div className="text-center">
          <button
            type="button" // Use type="button" if it doesn't submit the form
            className="text-sm font-medium text-green-600 hover:text-green-700 focus:outline-none focus:underline"
            onClick={() => {
              // Handle navigation or modal popup for account creation
              console.log("Navigate to Create Account");
            }}
          >
            Create new account
          </button>
          <Toaster />
        </div>
      </div>
    </div>
  );
}

export default Login;
