"use client";

import { useBookStore } from "@/stores/useBookStore";
import BookDialog from "./BookDialog";
import SmallBookCard from "./SmallBookCard";

export default function BookList() {
    const { localBooks, removeBook } = useBookStore();

    return (
        <div className="flex flex-row ">
            {localBooks.map((book, i) => (
                <SmallBookCard
                    key={i}
                    book={book}
                    onDelete={(bookId: string) => {
                        removeBook(bookId);
                    }}
                />
            ))}
            <BookDialog />
        </div>
    );
}
