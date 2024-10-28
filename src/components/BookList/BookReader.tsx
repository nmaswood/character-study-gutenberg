import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

const WORDS_PER_PAGE = 200;

export default function BookReader({ bookContent }: { bookContent: string }) {
    const [currentPageNumber, setCurrentPageNumber] = useState(0);
    const [currentPage, setCurrentPage] = useState(
        bookContent
            .split(" ")
            .slice(currentPageNumber * WORDS_PER_PAGE, WORDS_PER_PAGE)
            .join(" ")
    );

    const wordsInBook = useMemo(
        () => bookContent.split(" ").length,
        [bookContent]
    );
    const prevPage = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setCurrentPageNumber(Math.max(0, currentPageNumber - 1));
    };

    const nextPage = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setCurrentPageNumber(
            Math.min(
                currentPageNumber + 1,
                Math.round(wordsInBook / WORDS_PER_PAGE)
            )
        );
    };

    useEffect(() => {
        const currentPageStart = currentPageNumber * WORDS_PER_PAGE;
        const currentPageEnd =
            currentPageNumber * WORDS_PER_PAGE + WORDS_PER_PAGE;
        const newCurrentPage = bookContent
            .split(" ")
            .slice(currentPageStart, currentPageEnd)
            .join(" ");

        console.log({ currentPage });
        setCurrentPage(newCurrentPage);
    }, [bookContent, currentPage, currentPageNumber]);

    return (
        <div className="lg:max-w-screen-sm max-h-screen overflow-hidden">
            <div className="flex flex-row w-full justify-center pb-4">
                <Label>Page {currentPageNumber + 1}</Label>
            </div>
            <ScrollArea className="h-[400px] rounded-md border p-4 whitespace-pre-wrap overflow-y-auto">
                {/* {bookContent} */}
                {currentPage}
            </ScrollArea>
            <div className="flex flex-row items-center gap-3 w-full justify-center">
                <Button type="button" onClick={prevPage}>
                    {"<"}
                </Button>
                <div>Page {currentPageNumber + 1}</div>
                <Button type="button" onClick={nextPage}>
                    {">"}
                </Button>
            </div>
        </div>
    );
}
