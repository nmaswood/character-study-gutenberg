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
import { formatNumber } from "../../lib/utils";
import useBookDialog from "@/app/hooks/useBookDialog";
import BookReader from "./BookReader";
import { LoadingSpinner } from "../ui/loading-spinner";

export default function BookDialog() {
    const { openedBook, onOpenChange, analyzeBook, isAnalyzing, totalCount } =
        useBookDialog();

    if (!openedBook) return <></>;

    console.log(openedBook);
    return (
        <Dialog open={openedBook !== null} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-1/2 min-h-1/2 lg:max-w-screen-sm max-h-[600px] overflow-auto">
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
                                        {formatNumber(totalCount[i])}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {openedBook.isAnalyzed ? (
                        <>
                            {openedBook.shortSummary && (
                                <div className="font-normal italic">
                                    {openedBook.shortSummary}
                                </div>
                            )}
                            <div className="flex flex-col gap-2 pt-4">
                                {openedBook.characters?.map((character, i) => (
                                    <div key={i} className="text-blue-950">
                                        <Button type="button">
                                            Chat with {character}{" "}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-row items-start">
                            <Button
                                type="button"
                                disabled={isAnalyzing}
                                onClick={async (e) => {
                                    e.preventDefault();
                                    await analyzeBook(openedBook);
                                }}
                            >
                                Analyze {isAnalyzing && <LoadingSpinner />}
                            </Button>
                        </div>
                    )}

                    <DialogDescription>
                        {" "}
                        {/* Move descriptive text here if needed */}
                        {/* Additional content like the book's metadata or summary */}
                    </DialogDescription>
                </DialogHeader>

                <BookReader bookContent={openedBook.bookContent} />

                <div className="grid gap-4 py-4"></div>

                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
