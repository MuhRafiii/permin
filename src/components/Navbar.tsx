"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Navbar({ isLoggedIn, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const publicLinks = [
    { label: "Home", href: "/user" },
    { label: "Books", href: "/user/books" },
    { label: "Persist", href: "/user/persist" },
  ];

  const userLinks = [
    ...publicLinks,
    { label: "My Favorite", href: "/user/favorites" },
    { label: "Borrowing & History", href: "/user/borrowings" },
  ];

  const links = isLoggedIn ? userLinks : publicLinks;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <div className="text-lg font-bold text-gray-800">📚 PERMIN</div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-gray-500 font-semibold">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-blue-600 ${
                pathname === link.href ? "text-blue-500 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Button size="sm" variant="outline" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" className="text-sm font-semibold">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown with transition */}
      <div
        className={`lg:hidden bg-white shadow-md px-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 py-4" : "max-h-0 py-0"
        }`}
      >
        <div className="space-y-4 text-gray-600 font-medium">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block hover:text-blue-600 ${
                pathname === link.href ? "text-blue-500 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
            >
              Logout
            </Button>
          ) : (
            <Link href="/auth/login" onClick={() => setIsOpen(false)}>
              <Button size="sm" className="w-full text-sm font-semibold">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
