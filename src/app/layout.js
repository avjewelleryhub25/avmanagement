// app/layout.js
import NavBar from "../components/NavBar/NavBar";
import "./globals.css";

export const metadata = {
  title: "JewelTrendz - Manage Your Jewellery Business",
  description:
    "JewelTrendz: A dashboard to manage your artificial jewellery e-commerce business, track inventory, sales, and profits across Instagram, Meesho, Flipkart, and Amazon.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-gray-100 text-gray-900">
        <NavBar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}