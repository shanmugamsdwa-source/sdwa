import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
