"use client";

import BookList from "@/components/BookList";
import FetchBookInput from "../components/FetchBook/FetchBookInput";
import { Toaster } from "sonner";
import BookDialog from "@/components/BookDialog";

export default function Home() {
  return (
    <div className="absolute inset-0 z-[-3] bg-neutral-950">
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        {/* Main content aligned towards the top */}
        <main className="flex h-full w-full flex-col items-center justify-start gap-8 px-4 py-6 pt-10 sm:items-center md:p-8 lg:p-8">
          <div className="flex w-full max-w-screen-sm justify-center pt-10">
            <FetchBookInput />
          </div>
          <div className="z-10 w-full max-w-screen-lg">
            <BookList />
            <BookDialog />
          </div>
          <Toaster />
        </main>
      </div>
    </div>
  );
}
