"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type FetchedBook = {
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

export type Book = {
    id: string;
    title: string;
    authors: string;
    subjects: string[];
    languages: string[];
    fetchDate: Date;
};

export type LoadedBook = Book & {
    bookContent: string;
    isAnalyzed: boolean;
    characters?: {
        id: number;
        characterName: string;
        quotes: string[];
    }[];
    shortSummary?: string;
};

type BookState = {
    localBooks: Array<Book | LoadedBook>;
};

type BookAction = {
    addBook: (book: FetchedBook) => void;
    getBook: (bookId: string) => Book | LoadedBook;
    removeBook: (bookId: string) => void;
    isLoadedBook: (book: Book | LoadedBook) => book is LoadedBook;
    loadBookContent: (bookId: string, bookContent: string) => LoadedBook;
};

export const useBookStore = create<BookState & BookAction>()(
    persist(
        (set, get) => ({
            localBooks: [],
            addBook: (book: FetchedBook) =>
                set((state) => ({
                    localBooks: [
                        ...state.localBooks,
                        {
                            ...book,
                            authors: book.authors
                                .map((author) =>
                                    author.name.split(",").reverse().join(" ")
                                )
                                .join(", "),
                            fetchDate: new Date(),
                        },
                    ],
                })),
            getBook: (bookId: string) => {
                const book = get().localBooks.find(
                    (book) => book.id === bookId
                );
                if (!book) {
                    throw new Error(`Book with ID ${bookId} not found`);
                }
                return book;
            },
            removeBook: (bookId: string) =>
                set((state) => ({
                    localBooks: state.localBooks.filter(
                        (book) => book.id !== bookId
                    ),
                })),
            loadBookContent: (
                bookId: string,
                bookContent: string,
                isAnalyzed = false
            ) => {
                let newBookIndx = null;

                const newBooks = get().localBooks.map((book, i) => {
                    if (book.id !== bookId) return book;

                    newBookIndx = i;

                    return { ...book, bookContent, isAnalyzed } as LoadedBook;
                });

                if (newBookIndx === null) {
                    throw new Error(`Book ID ${bookId} not in book list`);
                }

                set(() => ({ localBooks: newBooks }));

                return newBooks[newBookIndx] as LoadedBook;
            },
            isLoadedBook: (book: Book | LoadedBook): book is LoadedBook =>
                (book as LoadedBook).bookContent !== undefined,
        }),
        {
            name: "book-store",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
