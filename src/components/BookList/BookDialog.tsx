"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useBookUIStore } from "@/stores/useBookUIStore";
import { ScrollArea } from "../ui/scroll-area";
import { useMemo } from "react";
import { encode } from "gpt-tokenizer";
import { formatNumber } from "../../lib/utils";
import useBookDialog from "@/app/hooks/useBookDialog";

export default function BookDialog() {
    const { openedBook, closeBook } = useBookUIStore();
    const { sendBook } = useBookDialog();

    console.log({ openedBook, open: openedBook !== null });

    const onOpenChange = (open: boolean) => {
        if (!open) {
            closeBook();
        }
    };

    const wordCountTokenArr = useMemo(() => {
        if (!openedBook) return [0, 0];
        const bookContent = openedBook.bookContent;
        const tokenCount = encode(bookContent).length;
        const wordCount = bookContent.split(" ").length;

        return [wordCount, tokenCount];
    }, [openedBook]);

    // TODO Add page logic
    // const getBookTitle = () => {};
    // const getPage = (page: number = 1) => {
    //     if (openedBook) {
    //         const textArr = openedBook.bookContent.split(" ");
    //         const pageCount = 50;
    //         const wordCountByPage = textArr.length / pageCount;

    //         const wordsOnPage = textArr.slice(
    //             Math.min(
    //                 wordCountByPage * (pageCount - 1),
    //                 page * wordCountByPage
    //             ),
    //             Math.min(textArr.length - 1, (page + 1) * wordCountByPage)
    //         );

    //         return wordsOnPage.join(" ");
    //     }
    // };

    if (!openedBook) return <></>;

    return (
        <Dialog open={openedBook !== null} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-1/2 min-h-1/2 lg:max-w-screen-sm overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>{openedBook?.title}</DialogTitle>
                    <DialogHeader>by {openedBook?.authors}</DialogHeader>
                    <div className="flex">
                        {["Word Count", "Token Count"].map((key, i) => {
                            return (
                                <div
                                    key={i}
                                    className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                >
                                    <span className="text-xs text-muted-foreground">
                                        {key}
                                    </span>
                                    <span className="text-lg font-bold leading-none sm:text-3xl">
                                        {formatNumber(wordCountTokenArr[i])}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex flex-row items-start">
                        <Button
                            type="button"
                            onClick={async (e) => {
                                e.preventDefault();
                                await sendBook(openedBook);
                            }}
                        >
                            Get Characters
                        </Button>
                    </div>

                    <DialogDescription>
                        {" "}
                        {/* Move descriptive text here if needed */}
                        {/* Additional content like the book's metadata or summary */}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[400px] rounded-md border p-4 whitespace-pre-wrap">
                    {" "}
                    {/* Move ScrollArea outside DialogDescription */}
                    {openedBook?.bookContent}
                </ScrollArea>
                <div className="grid gap-4 py-4"></div>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
