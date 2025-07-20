import Link from "next/link";
import { useState } from "react";
import { ModeToggle } from "./Darkmode";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-foreground">
                Gather Beyond
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {/* Features */}
            </Link>
            <Link
              href="/community"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {/* Community */}
            </Link>
            <Link
              href="/pricing"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {/* Pricing */}
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {/* About */}
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              {/* Sign In */}
            </Link>
            <ModeToggle /> {/* เพิ่ม Dark Mode Toggle */}
            <Link
              href="/admin"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Admin Panel
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span
                className={`block w-full h-0.5 bg-foreground transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              ></span>
              <span
                className={`block w-full h-0.5 bg-foreground transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-full h-0.5 bg-foreground transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg">
            <nav className="px-4 py-4 space-y-4">
              <Link
                href="/features"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {/* Features */}
              </Link>
              <Link
                href="/community"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {/* Community */}
              </Link>
              <Link
                href="/pricing"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {/* Pricing */}
              </Link>
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-primary transition-colors font-medium"
              >
                {/* About */}
              </Link>
              <div className="pt-4 border-t border-border space-y-2">
                <Link
                  href="/login"
                  className="block text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  {/* Sign In */}
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme:</span>
                  <ModeToggle /> {/* เพิ่ม Dark Mode Toggle สำหรับ Mobile */}
                </div>
                <Link
                  href="/admin"
                  className="block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 text-center"
                >
                  Admin Panel
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;