"use client";
import { useState } from "react";

// https://www.gutenberg.org/ebooks/1533.txt.utf-8

export default function useFetchBookInput() {
    const [bookId, setBookId] = useState("");
    // const [debouncedValue, setDebouncedValue] = useState("");

    // // Debounce function
    // useEffect(() => {
    //     const handler = setTimeout(() => {
    //         if (bookId.length !== 0) setDebouncedValue(bookId);
    //     }, 1500); // 500ms delay

    //     // Cleanup the timeout if the value changes before the delay is complete
    //     return () => {
    //         clearTimeout(handler);
    //     };
    // }, [bookId]); // This effect depends on inputValue

    const fetchBook = async () => {
        const response = await fetch(`/api/book/${bookId}`);
        console.log(await response.json());
    };
    const onBookIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBookId(e.target.value);
    };

    return {
        bookId,
        onBookIdChange,
        fetchBook,
    };
}
