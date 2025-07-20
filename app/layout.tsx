import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/convexClerkProvider";
import HeaderWrapper from "@/components/HeaderWrapper";
import 'leaflet/dist/leaflet.css';


const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FARMINNOVATE",
  description: "A farmer's Portal",
  icons: {
    icon: "/icons/logo1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
        <html>
          <body className={`${manrope.className}`}>
            <HeaderWrapper/>
            <main className="relative z-10">{children}</main>
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
