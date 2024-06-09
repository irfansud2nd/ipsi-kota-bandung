import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "animate.css";
import Navbar from "@/components/navbar/Navbar";
import FooterOwner from "@/components/footer/FooterOwner";
import FooterInformation from "@/components/footer/FooterInformation";
import SessionProvider from "@/components/auth/SessionProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { Toaster } from "sonner";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - IPSI Kota Bandung",
    default: "IPSI Kota Bandung",
  },
  description: "Dapatkan informasi terbaru tentang IPSI Kota Bandung disini",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="scroll-smooth">
      <SessionProvider session={session}>
        <body
          className={`${poppins.className} grid grid-rows-[1fr_auto] min-h-screen`}
        >
          <Toaster position="top-center" richColors />
          <Navbar />
          <main className="pt-[50px] sm:pt-[70px] min-h-screen">
            {children}
          </main>
          <footer>
            <FooterInformation />
            <FooterOwner />
          </footer>
        </body>
      </SessionProvider>
    </html>
  );
}
