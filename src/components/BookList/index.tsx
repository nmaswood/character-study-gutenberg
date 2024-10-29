"use client";

import { useBookStore } from "@/stores/useBookStore";
import BookDialog from "../BookDialog";
import SmallBookCard from "./SmallBookCard";

export default function BookList() {
    const { localBooks, removeBook, _hasHydrated } = useBookStore();

    if (!_hasHydrated) return <>loading</>;

    return (
        <div className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-fit ">
            {localBooks
                .sort(
                    (a, b) =>
                        new Date(b.fetchDate).getTime() -
                        new Date(a.fetchDate).getTime()
                )
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
