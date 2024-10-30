import { Book } from "@/stores/useBookStore";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Book as BookIcon } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";
import useFetchBook from "@/app/hooks/useFetchBook";
import Image from "next/image";

export default function SmallBookCard({ book, onDelete }: { book: Book; onDelete: (bookId: string) => void }) {
  const { openBook, loadingBookContent } = useFetchBook();
  return (
    <Card className="flex flex-col justify-between overflow-auto px-3 lg:w-[300px]">
      <Image
        src={`https://www.gutenberg.org/cache/epub/${book.id}/pg${book.id}.cover.medium.jpg`}
        alt="book cover"
        width={200}
        height={200}
      />
      <CardHeader>
        <CardTitle>
          {" "}
          {book.title} <p className="inline text-slate-600"> #{book.id}</p>
        </CardTitle>
        <CardDescription>by {book.authors}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div className="bold">
          Topics:
          {book.subjects
            .join(" ")
            .split("--")
            .map((text, i) => <div key={i}>{text}</div>)
            .slice(
              0,
              // the metadata uses -- to split
              Math.min(5, book.subjects.join(" ").split("--").length),
            )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            openBook(book.id);
          }}
        >
          Open {loadingBookContent && <LoadingSpinner />} <BookIcon />
        </Button>
        <Button
          variant="destructive"
          onClick={(e) => {
            e.preventDefault();
            onDelete(book.id);
          }}
        >
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
}
