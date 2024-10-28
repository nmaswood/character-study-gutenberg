"use client";

import { LoadedBook } from "@/stores/useBookStore";
import { useBookUIStore } from "@/stores/useBookUIStore";
import axios from "axios";
import { encode } from "gpt-tokenizer";
import { useMemo, useState } from "react";
import { AnalyzeBookResponse } from "../api/model/book/analyze/route";

export default function useBookDialog() {
    const { openedBook, closeBook, setOpenedBook } = useBookUIStore();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const analyzeBook = async (book: LoadedBook) => {
        setIsAnalyzing(true);

        try {
            const response = await axios.post("/api/model/book/analyze", book);
            const bookAnalysis: AnalyzeBookResponse = response.data;

            if (openedBook) {
                setOpenedBook({
                    ...openedBook,
                    isAnalyzed: true,
                    characters: bookAnalysis.characters,
                    shortSummary: bookAnalysis.shortSummary,
                });
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
        } finally {
            setIsAnalyzing(false);
        }
    };

    const totalCount = useMemo(() => {
        if (!openedBook) return [0, 0];
        const bookContent = openedBook.bookContent;
        const tokenCount = encode(bookContent).length;
        const wordCount = bookContent.split(" ").length;

        return [wordCount, tokenCount];
    }, [openedBook]);

    const onOpenChange = (open: boolean) => {
        if (!open) {
            closeBook();
        }
    };

    return {
        analyzeBook,
        totalCount,
        onOpenChange,
        openedBook,
        isAnalyzing,
    };
}
