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
import BookReader from "../BookList/BookReader";
import { LoadingSpinner } from "../ui/loading-spinner";

export default function BookDialog() {
    const {
        activeCharacter,
        analyzeBook,
        handleChatOpen,
        handleCloseChat,
        isAnalyzing,
        isChatOpen,
        onOpenChange,
        openedBook,
        totalCount,
    } = useBookDialog();

    if (!openedBook) return <></>;

    return (
        <Dialog open={openedBook !== null} onOpenChange={onOpenChange}>
            <DialogContent
                className={`flex min-h-1/2 max-h-[600px] transition-all duration-300 min-w-[800px] pr-12 ${
                    isChatOpen ? "sm:max-w-[80vw]" : "sm:max-w-1/2"
                }`}
            >
                {/* Left section - Book details */}
                <div
                    className={`flex-1 px-2 overflow-auto ${
                        isChatOpen ? "border-r" : ""
                    }`}
                >
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            {openedBook.title}
                        </DialogTitle>
                        <div className="text-lg">by {openedBook.authors}</div>
                        <div className="flex">
                            {["Word Count", "Token Count"].map((key, i) => (
                                <div
                                    key={i}
                                    className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                >
                                    <span className="text-xs text-muted-foreground">
                                        {key}
                                    </span>
                                    <span className="text-lg font-bold sm:text-3xl">
                                        {formatNumber(totalCount[i])}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {openedBook.isAnalyzed ? (
                            <>
                                {openedBook.shortSummary && (
                                    <div className="font-normal italic">
                                        {openedBook.shortSummary}
                                    </div>
                                )}
                                <div className="w-full grid grid-cols-2 grid-rows-2 grid-flow-row gap-2">
                                    {openedBook.characters?.map(
                                        (character, i) => (
                                            <div key={i} className="px-2">
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        handleChatOpen(
                                                            character
                                                        )
                                                    }
                                                >
                                                    Chat with {character}
                                                </Button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-row justify-end pr-4">
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
                            {/* Additional content like the book's metadata or summary */}
                        </DialogDescription>
                    </DialogHeader>
                    <BookReader bookContent={openedBook.bookContent} />
                </div>

                {/* Right section - Chat panel, only visible when a character is selected */}
                {isChatOpen && activeCharacter && (
                    <div className="w-1/2 p-4 border-l">
                        <DialogTitle>Chat with {activeCharacter}</DialogTitle>
                        <div className="text-muted-foreground">
                            {/* Placeholder for the chat window */}
                            This is where the chat window with {
                                activeCharacter
                            }{" "}
                            will appear.
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleCloseChat}
                            className="mt-4"
                        >
                            Close Chat
                        </Button>
                    </div>
                )}
            </DialogContent>
            <DialogFooter>{/* Footer if needed */}</DialogFooter>
        </Dialog>
    );
}
