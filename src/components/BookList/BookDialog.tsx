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

export default function BookDialog() {
    const { openedBook, closeBook } = useBookUIStore();

    console.log({ openedBook, open: openedBook !== null });

    const onOpenChange = (open: boolean) => {
        if (!open) {
            closeBook();
        }
    };

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
    return (
        <Dialog open={openedBook !== null} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-1/2 min-h-1/2 lg:max-w-screen-lg overflow-y-scroll max-h-screen">
                <DialogHeader>
                    <DialogTitle>{openedBook?.title}</DialogTitle>
                    <DialogHeader>by {openedBook?.authors}</DialogHeader>
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
                <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
