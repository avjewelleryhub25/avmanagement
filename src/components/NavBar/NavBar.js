// components/NavBar.js
"use client"
import React, { useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";

export default function NavBar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-jewelGold text-white p-4 shadow-md flex">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">JewelTrendz</div>
        <div className="flex gap-6 items-center max-md:hidden">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/products" className="hover:underline">
            Products
          </Link>
          <Link href="/history" className="hover:underline">
            Sales History
          </Link>
          <Link href="/analytics" className="hover:underline">
            Analytics
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      <div className="md:hidden relative">
        <button className="text-white focus:outline-none" onClick={toggleMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 w-48 bg-jewelGold mt-2 shadow-lg z-10">
            <Link href="/dashboard" className="block py-2 px-4 hover:bg-jewelDarkGold">
              Dashboard
            </Link>
            <Link href="/products" className="block py-2 px-4 hover:bg-jewelDarkGold">
              Products
            </Link>
            <Link href="/history" className="block py-2 px-4 hover:bg-jewelDarkGold">
              Sales History
            </Link>
            <Link href="/analytics" className="block py-2 px-4 hover:bg-jewelDarkGold">
              Analytics
            </Link>
            <Button variant="outline" onClick={handleLogout} className="w-full mt-2">
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}