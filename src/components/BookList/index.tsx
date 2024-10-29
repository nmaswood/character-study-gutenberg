"use client";

import { useBookStore } from "@/stores/useBookStore";
import BookDialog from "../BookDialog";
import SmallBookCard from "./SmallBookCard";

export default function BookList() {
    const { localBooks, removeBook } = useBookStore();

    console.log(localBooks);
    return (
        <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-fit ">
            {localBooks
                .sort((a, b) => b.fetchDate.getTime() - a.fetchDate.getTime())
                .map((book, i) => (
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
