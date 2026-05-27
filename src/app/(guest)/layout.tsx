import { Navbar } from "@/components/guest/navbar";
import { Footer } from "@/components/guest/footer";
import { CartSidebar } from "@/components/guest/cart-sidebar";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <CartSidebar />
      <Footer />
    </>
  );
}
