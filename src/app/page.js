// app/page.js
import Link from "next/link";
import Button from "../components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-amber-100 to-jewelGold">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg text-center">
        <h1 className="text-4xl font-bold text-jewelGold mb-4">Welcome to JewelTrendz</h1>
        <p className="text-gray-700 mb-6">
          Manage your artificial jewellery business with ease. Track inventory, record sales, and analyze profits across Instagram, Meesho, Flipkart, and Amazon. Source trendy products from wholesale markets and grow your brand with our powerful dashboard.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login">
            <Button>Login</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}