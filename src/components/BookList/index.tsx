"use client";

import { useBookStore } from "@/stores/useBookStore";
import BookDialog from "./BookDialog";
import SmallBookCard from "./SmallBookCard";
import useFetchBook from "@/app/hooks/useFetchBook";

export default function BookList() {
    const { localBooks, removeBook } = useBookStore();
    const { openBook, loadingBookContent } = useFetchBook();

    return (
        <div className="flex flex-row ">
            {localBooks.map((book, i) => (
                <SmallBookCard
                    key={i}
                    book={book}
                    onDelete={(bookId: string) => {
                        removeBook(bookId);
                    }}
                    openBook={openBook}
                    loadingBookContent={loadingBookContent}
                />
            ))}
            <BookDialog />
        </div>
    );
}
