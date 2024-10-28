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
import { LoadingSpinner } from "../ui/loading-spinner";
import useFetchBook from "@/app/hooks/useFetchBook";

export default function SmallBookCard({
    book,
    onDelete,
}: {
    book: Book;
    onDelete: (bookId: string) => void;
}) {
    const { openBook, loadingBookContent } = useFetchBook();

    return (
        <Card className="w-[300px] h-[400px] mx-5 flex-col items-end">
            <CardHeader>
                <CardTitle> {book.title}</CardTitle>
                <CardDescription>by {book.authors}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    variant="outline"
                    onClick={(e) => {
                        e.preventDefault();
                        openBook(book.id);
                    }}
                >
                    Open Book {loadingBookContent && <LoadingSpinner />}{" "}
                    <BookIcon />
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
            </CardContent>
            <CardFooter className="flex justify-between items-end">
                <div className="bold">
                    Topics:
                    {book.subjects
                        .join(" ")
                        .split("--")
                        .map((text, i) => <div key={i}>{text}</div>)
                        .slice(
                            0,
                            // the metadata uses -- to split
                            Math.min(
                                5,
                                book.subjects.join(" ").split("--").length
                            )
                        )}
                </div>
            </CardFooter>
        </Card>
    );
}
