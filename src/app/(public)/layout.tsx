import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";

/**
 * Public Layout — wraps all customer-facing pages.
 * 
 * This layout adds the Header (navigation bar) at the top
 * and the Footer (with legal links) at the bottom.
 * 
 * The <main> element uses min-h-screen with flex layout to
 * ensure the footer stays at the bottom even on short pages.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
