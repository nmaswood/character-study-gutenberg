"use client";
import { axiosClient } from "@/lib/axios-client";
import { Book, LoadedBook, useBookStore } from "@/stores/useBookStore";
import { useBookUIStore } from "@/stores/useBookUIStore";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { FetchedBook } from "../../stores/useBookStore";
import { AnalyzeBookResponse } from "../api/model/book/analyze/route";

export default function useFetchBook() {
    const [bookId, setBookId] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingBookContent, setLoadingBookContent] = useState(false);

    const { setOpenedBook } = useBookUIStore();

    const { localBooks, addBook, getBook, isLoadedBook, loadBookContent } =
        useBookStore();

    const fetchBookMetadata = async () => {
        setLoading(true);

        try {
            let book: Book | FetchedBook | undefined = localBooks.find(
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

            book = (await response.json()) as FetchedBook;

            if (book) {
                toast.success("Book successfully fetched");

                addBook(book);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchBookContent = async (bookId: string): Promise<string> => {
        try {
            const bookContent = await axiosClient
                .get("/api/book/" + bookId)
                .then((response) => response.data);
            return bookContent;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error({
                    error: {
                        cause: error.cause,
                        code: error.code,
                    },
                });
            }

            throw new Error("Error: could not load book");
        }
    };

    const checkIfBookIsAnalyzed = async (
        bookId: string
    ): Promise<{
        isAnalyzed: boolean;
        characters?: string[];
        shortSummary?: string;
    }> => {
        {
            try {
                const analyzedBook: AnalyzeBookResponse = (
                    await axios.get("/api/model/book/" + bookId)
                ).data;

                return {
                    isAnalyzed: true,
                    characters: analyzedBook.characters,
                    shortSummary: analyzedBook.shortSummary,
                };
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log({
                        error: {
                            cause: error.cause,
                            code: error.code,
                            message: "Book is not analyzed",
                        },
                    });
                }
                return { isAnalyzed: false };
            }
        }
    };

    const openBook = async (bookId: string) => {
        setLoadingBookContent(true);

        const book = getBook(bookId);
        let loadedBook: LoadedBook;

        if (!isLoadedBook(book)) {
            const bookContent = await fetchBookContent(bookId);
            loadedBook = loadBookContent(bookId, bookContent);
        } else {
            loadedBook = book;
        }

        const { isAnalyzed, characters, shortSummary } =
            await checkIfBookIsAnalyzed(bookId);

        if (isAnalyzed) {
            setOpenedBook({
                ...loadedBook,
                isAnalyzed: true,
                characters: characters,
                shortSummary: shortSummary,
            });
        } else setOpenedBook(loadedBook);

        setLoadingBookContent(false);
    };

    const onBookIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookId(e.target.value);
    };

    return {
        bookId,
        loading,
        loadingBookContent,
        openBook,
        onBookIdChange,
        fetchBookMetadata,
        fetchBookContent,
    };
}
