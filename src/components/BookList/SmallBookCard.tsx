import { Book } from "@/stores/useBookStore";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Book as BookIcon } from "lucide-react";

export default function SmallBookCard({
    book,
    onDelete,
    openBook,
}: {
    book: Book;
    onDelete: (bookId: string) => void;
    openBook: (bookId: string) => void;
}) {
    return (
        <Card className="w-[300px] h-[400px] mx-5 flex-col items-end">
            <CardHeader>
                <CardTitle> {book.title}</CardTitle>
                <CardDescription>by {book.authors}</CardDescription>
            </CardHeader>
            <CardContent>
                {book.subjects
                    .join(" ")
                    .split("--")
                    .map((text, i) => <div key={i}>{text}</div>)
                    .slice(
                        0,
                        Math.min(5, book.subjects.join(" ").split("--").length)
                    )}
            </CardContent>
            <CardFooter className="flex justify-between items-end">
                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        openBook(book.id);
                    }}
                >
                    Open Book <BookIcon />
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
