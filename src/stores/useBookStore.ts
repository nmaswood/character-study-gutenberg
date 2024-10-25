"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Book = {
    id: string;
    title: string;
    authors: {
        name: string;
        birth_year: number | null;
        death_year: number | null;
    }[];
    subjects: string[];
    languages: string[];
    formats: {
        [format: string]: string;
    };
};

export type LoadedBook = Book & {
    bookContent: string;
};

type BookState = {
    localBooks: Book[];
};

type BookAction = {
    addBook: (book: Book) => void;
    getBook: (bookId: string) => Book | undefined;
    removeBook: (bookId: string) => void;
};

export const useBookStore = create<BookState & BookAction>()(
    persist(
        (set, get) => ({
            localBooks: [],
            addBook: (book: Book) =>
                set(() => ({
                    localBooks: [...get().localBooks, book],
                })),
            getBook: (bookId: string) =>
                get().localBooks.find((book) => book.id === bookId),
            removeBook: (bookId: string) =>
                set(() => ({
                    localBooks: get().localBooks.filter(
                        (book) => book.id !== bookId
                    ),
                })),
        }),
        {
            name: "book-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
