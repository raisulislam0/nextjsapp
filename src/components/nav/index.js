// components/navbar.js

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-lg">
          <Link href="/">Ichchapuron Limited</Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/" className="text-gray-300 hover:text-white">
            Users
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white">
            About
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button className="text-gray-300 hover:text-white focus:outline-none">
            {/* You can use an icon here */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
