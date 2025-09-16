// app/login/page.js
"use client";
import React, { useState } from "react";
import Button from "../../components/ui/Button";
import Link from "next/link";

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // Only for register
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      setLoading(false);
      return;
    }
    if (!isLoginMode && !formData.name) {
      setError("Name is required for registration");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Store JWT token and redirect to dashboard
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-100 to-jewelGold">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-jewelGold mb-6 text-center">
          {isLoginMode ? "Login to AV Jewellery" : "Register for AV Jewellery"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
                placeholder="e.g., Admin User"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
              placeholder="e.g., admin@AV Jewellery.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-jewelGold focus:border-jewelGold"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : isLoginMode ? "Login" : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {isLoginMode ? "Need an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError("");
              setFormData({ email: "", password: "", name: "" });
            }}
            className="ml-1 text-jewelGold hover:underline"
          >
            {isLoginMode ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}