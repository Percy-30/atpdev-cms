import "../../globals.css";
import Navbar from "@/components/Navbar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 w-full pt-16">
        {children}
      </main>
    </div>
  );
}
