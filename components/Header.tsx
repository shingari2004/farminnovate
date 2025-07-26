"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useRef, useState } from "react";
import HeaderLine from "./headerLine";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const userBtnRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleClick = () => {
    if (isSignedIn) {
      // If needed, you could toggle a menu here, or just rely on UserButton
      <UserButton afterSignOutUrl="/home" />; // Optional: if wrapping logic required
    } else {
      router.push("/sign-in");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="relative top-0 z-50 header-background header-color shadow-md">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-6 xl:px-10 py-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div>
            <Image
              src="/icons/logo1.png"
              alt="logo"
              width={50}
              height={50}
              className="w-10 h-10 xl:w-12 xl:h-12"
            />
          </div>
          <div>
            <h1 className="text-lg xl:text-xl font-bold">FARMINNOVATE</h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <HeaderLine />

        {/* User Profile Section */}
        <div
          className="bg-yellow-400 text-black rounded-2xl p-2 xl:p-3 flex items-center gap-2 hover:bg-yellow-300 transition-colors cursor-pointer"
          onClick={handleClick}
        >
          <div className="cursor-pointer">
            {isSignedIn ? (
              <div
                ref={userBtnRef}
                className="font-bold flex items-center gap-1.5"
              >
                <span className="hidden xl:inline">{user.fullName}</span>
                <span className="xl:hidden">{user.firstName}</span>
                <UserButton afterSignOutUrl="/home" />
              </div>
            ) : (
              <span className="font-normal">Sign In</span>
            )}
          </div>
        </div>
      </div>

      {/* Tablet Header */}
      <div className="hidden md:flex lg:hidden items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <div>
            <Image
              src="/icons/logo1.png"
              alt="logo"
              width={40}
              height={40}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold">FARMINNOVATE</h1>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* User Profile Section */}
        <div
          className="bg-yellow-400 text-black rounded-2xl p-2 flex items-center gap-2 hover:bg-yellow-300 transition-colors cursor-pointer"
          onClick={handleClick}
        >
          <div className="cursor-pointer">
            {isSignedIn ? (
              <div
                ref={userBtnRef}
                className="font-bold flex items-center gap-1.5"
              >
                {user.firstName}
                <UserButton afterSignOutUrl="/home" />
              </div>
            ) : (
              <span className="font-normal text-sm">Sign In</span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between px-4 py-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <div>
            <Image
              src="/icons/logo1.png"
              alt="logo"
              width={35}
              height={35}
            />
          </div>
          <div>
            <h1 className="text-base font-bold">
              <a href="/home">FARMINNOVATE</a>
            </h1>
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2">
          {/* User Profile Section */}
          <div
            className="bg-yellow-400 text-black rounded-xl px-2 py-1.5 flex items-center gap-1.5 hover:bg-yellow-300 transition-colors cursor-pointer"
            onClick={handleClick}
          >
            <div className="cursor-pointer">
              {isSignedIn ? (
                <div
                  ref={userBtnRef}
                  className="font-bold flex items-center gap-1"
                >
                  <span className="text-xs">{user.firstName}</span>
                  <div className="scale-75">
                    <UserButton afterSignOutUrl="/home" />
                  </div>
                </div>
              ) : (
                <span className="font-normal text-xs">Sign In</span>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Navigation Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-40">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile HeaderLine equivalent - you can customize this based on your HeaderLine component */}
            <nav className="space-y-4">
              <a href="/home" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors">
                HOME
              </a>
              <a href="/weatherPage" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors">
                WEATHER
              </a>
              <a href="/diseasePrediction" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors">
                DISEASE PREDICTION
              </a>
              <a href="/community" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors">
                COMMUNITY
              </a>
              <Link href="/marketPlace" className="block text-gray-700 hover:text-gray-900 font-medium transition-colors"/>
            </nav>
            
            {/* Additional mobile-specific actions can go here */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                {isSignedIn ? `Welcome, ${user.firstName}!` : 'Please sign in to continue'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-25 z-30"
          onClick={toggleMobileMenu}
        />
      )}
    </header>
  );
}