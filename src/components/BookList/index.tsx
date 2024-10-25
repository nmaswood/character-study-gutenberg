"use client";

import { useBookStore } from "@/stores/useBookStore";
import BookDialog from "./BookDialog";
import SmallBookItem from "./SmallBookItem";
import { useBookUIStore } from "@/stores/useBookUIStore";
import useFetchBookInput from "@/app/hooks/useFetchBookInput";

export default function BookList() {
    const { localBooks, removeBook, getBook } = useBookStore();
    const { setOpenedBook } = useBookUIStore();
    const { fetchBookContent } = useFetchBookInput();

    const openBook = async (bookId: string) => {
        const book = getBook(bookId);

        if (book) {
            const loadedBook = await fetchBookContent(bookId);

            console.log({ loadedBook });
            if (loadedBook) setOpenedBook(loadedBook);
        }
    };
    return (
        <div className="flex flex-row ">
            {localBooks.map((book, i) => (
                <SmallBookItem
                    key={i}
                    book={book}
                    onDelete={(bookId: string) => {
                        removeBook(bookId);
                    }}
                    openBook={openBook}
                />
            ))}
            <BookDialog />
        </div>
    );
}
