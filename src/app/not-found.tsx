import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-plum-dark sm:text-5xl">Page Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild><Link href="/">Go Home</Link></Button>
          <Button asChild variant="outline"><Link href="/booking">Book Appointment</Link></Button>
        </div>
      </div>
    </div>
  );
}
