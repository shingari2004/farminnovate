"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { useRef } from "react";
import HeaderLine from "./headerLine";
import Image from "next/image";

export default function Header() {
  const { user, isSignedIn } = useUser();
  const router = useRouter();
  const userBtnRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (isSignedIn) {
      // If needed, you could toggle a menu here, or just rely on UserButton
      <UserButton afterSignOutUrl="/home" />; // Optional: if wrapping logic required
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <header className="relative top-0 z-50 header-background header-color shadow-md">
      <div className="flex items-center justify-between px-10 py-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 pr-13">
          <div>
            <Image
              src="/icons/logo1.png"
              alt="background"
              width={40}
              height={40}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold">FARMTECH</h1>
            <p className="text-sm ">Innovators</p>
          </div>
        </div>

        {/* Navigation Menu */}

        <HeaderLine />

        {/* User Profile Section */}
        <div
          className=" bg-yellow-400 text-black rounded-2xl p-2 flex items-center gap-2 hover:bg-yellow-300 transition-colors cursor-pointer"
          onClick={handleClick}
        >
          <div className="cursor-pointer">
            {isSignedIn ? (
              <div
                ref={userBtnRef}
                className="font-bold flex items-center gap-1.5"
              >
                {user.fullName}
                <UserButton afterSignOutUrl="/home" />
              </div>
            ) : (
              <span className="font-normal">Sign In</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
