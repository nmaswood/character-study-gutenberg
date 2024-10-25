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
import { useCallback } from "react";

export default function SmallBookItem({
    book,
    onDelete,
    openBook,
}: {
    book: Book;
    onDelete: (bookId: string) => void;
    openBook: (bookId: string) => void;
}) {
    useCallback(() => book.authors.map((auth) => auth.name).join(", "), [book]);

    console.log(book);
    return (
        <Card className="w-[350px] mx-5">
            <CardHeader>
                <CardTitle> {book.title}</CardTitle>
                <CardDescription>
                    by {book.authors.map((auth) => auth.name).join(", ")}
                </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        openBook(book.id);
                    }}
                >
                    Fetch Contents
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
