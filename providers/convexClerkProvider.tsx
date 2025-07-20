"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { neobrutalism} from '@clerk/themes'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

const ConvexClerkProvider = ({ children }: { children: ReactNode }) => (
  <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string} appearance={{
    baseTheme:neobrutalism,
    signUp:{
      elements:{
        card:"w-[400px] h-[500px]",
      },
      variables:{
        fontSize: "0.75rem"
      }
    },
    variables: {
      colorPrimary: "#000000",          // You can customize this
      colorText: "#111827",             // Tailwind gray-900
      colorInputBackground: "#ffffff",
      colorInputText: "#000000",
      borderRadius: "5px",       // Remove rounding globally
    },
    elements: { // Removes the outer card shadow
      formButtonPrimary: "shadow-none", // Removes button shadow
      socialButtonsBlockButton: "shadow-none",
      card:"shadow-lg border border-gray-200" // Removes social button shadow
    },
    layout: {
      logoImageUrl: '/icons/logo1.png',  // <-- your icon path here
    },
  }}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>
);

export default ConvexClerkProvider;