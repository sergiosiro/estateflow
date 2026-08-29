import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-clear-day dark:bg-[#0d1816] text-nordic dark:text-[#e6f3f0] transition-colors duration-300">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Dashboard Container */}
      <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-4 md:px-8 py-8 gap-8">
        {/* Sidebar Navigation */}
        <DashboardSidebar />

        {/* Dynamic Canvas Area */}
        <section className="flex-grow flex flex-col gap-6 min-w-0">
          {children}
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
