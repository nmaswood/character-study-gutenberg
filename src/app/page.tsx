"use client";

import BookList from "@/components/BookList";
import FetchBookInput from "../components/FetchBook/FetchBookInput";
import { Toaster } from "sonner";
import BookDialog from "@/components/BookDialog";

export default function Home() {
  return (
    <div className="absolute inset-0 z-[-2] bg-white dark:bg-neutral-950">
      <div className="absolute inset-0 h-full w-full bg-[radial-gradient(60%_120%_at_50%_50%,hsla(0,0%,100%,0)_0,rgba(252,205,238,.5)_100%)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        {/* Main content aligned towards the top */}
        <main className="flex h-full w-full flex-col items-center justify-start gap-8 p-8 pt-10 sm:items-center">
          <div className="flex w-full max-w-screen-sm justify-center pt-10">
            <FetchBookInput />
          </div>
          <div className="w-full max-w-screen-lg">
            <BookList />
            <BookDialog />
          </div>
          <Toaster />
        </main>
      </div>
    </div>
  );
}
