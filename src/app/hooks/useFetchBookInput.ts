"use client";
import { axiosClient } from "@/lib/axios-client";
import { getBookMetadataLinks } from "@/lib/utils";
import { Book, LoadedBook, useBookStore } from "@/stores/useBookStore";
import { useBookUIStore } from "@/stores/useBookUIStore";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

// https://www.gutenberg.org/ebooks/1533.txt.utf-8

export default function useFetchBookInput() {
    const [bookId, setBookId] = useState("");
    const { setOpenedBook } = useBookUIStore();

    const { localBooks, addBook, getBook } = useBookStore();

    const openBook = async (bookId: string) => {
        const book = getBook(bookId);

        if (book) {
            console.log(await fetchBookContent(bookId));
        }
    };

    const fetchBookMetadata = async () => {
        let book: Book | undefined = localBooks.find(
            (book) => book.id === bookId
        );

        if (book) {
            toast.info("Book already in library");
            // let loadedBook: LoadedBook = await fetchBookContent(bookId);
            await openBook(bookId);
            return;
        }

        const response = await fetch(`/api/book/${bookId}/metadata`);

        if (response.status === 404) {
            toast.error("Book could not be found");
            return;
        }

        book = await response.json();

        if (book) {
            toast.success("Book successfully fetched");

            addBook(book);
            await openBook(bookId);
        }
    };

    const fetchBookContent = async (
        bookId: string
    ): Promise<LoadedBook | undefined> => {
        try {
            const book = getBook(bookId);

            if (book) {
                // Add case for not finding .txt url
                const bookContent = await axiosClient
                    .get("/api/book/" + bookId)
                    .then((response) => response.data);
                return { ...book, bookContent };
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log({
                    error: {
                        cause: error.cause,
                        code: error.code,
                    },
                });
            }
        }
    };

    const onBookIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookId(e.target.value);
    };

    return {
        bookId,
        onBookIdChange,
        fetchBookMetadata,
        fetchBookContent,
    };
}
