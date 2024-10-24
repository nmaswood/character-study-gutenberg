"use client";
import { useState, useEffect } from "react";

// https://www.gutenberg.org/ebooks/1533.txt.utf-8

export default function useFetchBookInput() {
    const [bookId, setBookId] = useState("");
    const [debouncedValue, setDebouncedValue] = useState("");
    const [bookFound, setBookFound] = useState(false);

    const fetchBookMetadata = async (bookId: string, signal?: AbortSignal) => {
        try {
            const response = await fetch(`/book/${bookId}/metadata`, {
                signal: signal,
            });

            if (signal && !signal.aborted) {
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setBookFound(true);
                } else {
                    console.error(`HTTP error! Status: ${response.status}`);
                }
            }
        } catch (error) {
            console.log(error);
            setBookFound(false);
        }
    };

    // Debounce function
    useEffect(() => {
        const handler = setTimeout(() => {
            if (bookId.length !== 0) setDebouncedValue(bookId);
        }, 500); // 500ms delay

        // Cleanup the timeout if the value changes before the delay is complete
        return () => {
            clearTimeout(handler);
        };
    }, [bookId]); // This effect depends on inputValue

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        if (debouncedValue.length !== 0)
            fetchBookMetadata(debouncedValue, signal);

        return () => {
            // Cancel the request when the component unmounts
            abortController.abort();
        };
    }, [debouncedValue]);

    const onBookIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookId(e.target.value);
    };

    return {
        bookId,
        onBookIdChange,
        bookFound,
    };
}
