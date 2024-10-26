"use client";

import { LoadedBook } from "@/stores/useBookStore";
import axios from "axios";

export default function useBookDialog() {
    const sendBook = async (book: LoadedBook) => {
        const response = await axios.post("/api/model", book);

        console.log({ data: response.data });
    };

    return { sendBook };
}
