"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-widest text-primary">500</p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-plum-dark sm:text-5xl">Something Went Wrong</h1>
        <p className="mt-4 text-muted-foreground">
          An unexpected error occurred while loading this page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try Again</Button>
          <Button asChild variant="outline"><Link href="mailto:hello@sanaaglam.com">Contact Support</Link></Button>
        </div>
      </div>
    </div>
  );
}
