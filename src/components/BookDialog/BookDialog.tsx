"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { formatNumber, MAX_ALLOWED_TOKEN_COUNT, MAX_RECOMMENDED_TOKEN_COUNT } from "../../lib/utils";
import useBookDialog from "@/app/hooks/useBookDialog";
import BookReader from "../BookList/BookReader";
import ChatDialog from "./ChatDialog";
import { courier } from "../fonts";
import { MessageCircleMore, MessageCirclePlus, TriangleAlert } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore";
import AnalysisButton from "./AnalysisButton";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "../ui/alert-dialog";

export default function BookDialog() {
	const {
		activeCharacter,

		handleAnalyze,
		handleChatOpen,
		handleCloseAlert,
		handleCloseChat,
		isAnalyzing,
		isChatOpen,
		onOpenChange,
		openedBook,
		totalCount,
		showAlert,
	} = useBookDialog();

	const { userChats } = useChatStore();

	console.log(showAlert);
	if (!openedBook) return <></>;

	return (
		<Dialog open={openedBook !== null} onOpenChange={onOpenChange}>
			<DialogContent
				className={`md:min-h-1/2 md flex h-full min-h-[700px] pr-12 pt-10 transition-all duration-100 md:max-h-[750px] md:min-w-[800px] md:pr-8 ${
					isChatOpen ? "sm:max-w-[80vw]" : "sm:max-w-1/2"
				}`}
			>
				{/* Left section - Book details */}
				<div className={`flex-1 overflow-auto md:block md:px-2 ${isChatOpen ? "hidden md:border-r lg:block" : ""}`}>
					<DialogHeader>
						<DialogTitle>
							<div className="pb-5 pt-5">
								<div className="inline text-xl font-bold">{openedBook.title + " "}</div>
								<div className="text-lg font-light"> by {openedBook.authors}</div>
							</div>
						</DialogTitle>
					</DialogHeader>
					{!openedBook.isAnalyzed && <AnalysisButton isAnalyzing={isAnalyzing} onAnalyzeButtonClick={handleAnalyze} />}
					{/* Book Content */}
					<div className="flex flex-col gap-8 pt-3 md:pt-8">
						{/* Short Summary */}
						{openedBook.isAnalyzed && openedBook.shortSummary && (
							<div className={`divide-y-2 text-sm opacity-95 md:text-base ${courier.className}`}>
								{openedBook.shortSummary}
							</div>
						)}
						<div className="flex flex-row divide-x-2 border-l sm:border-l sm:border-t-0">
							{["Word Count", "Token Count"].map((key, i) => (
								<div
									key={i}
									className="relative flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6"
								>
									<span className="text-xs font-semibold">{key}</span>
									<span className="text-lg font-bold sm:text-3xl">
										{formatNumber(totalCount[i])}
										{!openedBook.isAnalyzed && key === "Token Count" && totalCount[i] > MAX_RECOMMENDED_TOKEN_COUNT && (
											<div
												className="inline"
												title={
													totalCount[i] > MAX_ALLOWED_TOKEN_COUNT
														? `Gemini WILL FAIL to analyze the book due to the word count, please analyze a book less than 120k words`
														: `Gemini MIGHT FAIL to analyze the book due to the token count, either try again or analyze a book less than 120k tokens`
												}
											>
												<TriangleAlert
													className={`inline pb-1 pl-1 ${totalCount[i] > MAX_ALLOWED_TOKEN_COUNT ? "text-red-600" : "text-yellow-400"} `}
												/>
											</div>
										)}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* If analyzed, show book summary and character list */}
					<div className="divide-y-4 divide-double">
						{openedBook.isAnalyzed && (
							<div className="flex flex-col gap-8 pt-8">
								<div className="grid w-full grid-flow-row grid-cols-2 gap-3 md:grid-cols-3 md:gap-2">
									{openedBook.characters?.map((character, i) => (
										<Button type="button" onClick={() => handleChatOpen(character)} key={i}>
											{userChats.find((ch) => ch.characterId === character.id) ? (
												<MessageCircleMore />
											) : (
												<MessageCirclePlus />
											)}
											<div className="inline truncate">{character.characterName}</div>
										</Button>
									))}
								</div>
							</div>
						)}
					</div>
					<DialogDescription>{/* Additional content like the book's metadata or summary */}</DialogDescription>
					<BookReader bookContent={openedBook.bookContent} />
					<DialogClose asChild className="mt-5">
						<Button type="button" variant="secondary">
							Close Book
						</Button>
					</DialogClose>
				</div>

				{/* Right section - Chat panel, only visible when a character is selected */}
				{isChatOpen && activeCharacter && (
					<ChatDialog activeCharacter={activeCharacter} handleCloseChat={handleCloseChat} />
				)}
			</DialogContent>
			<AlertDialog open={showAlert.show} onOpenChange={handleCloseAlert} defaultOpen={showAlert.show}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>High token count detected</AlertDialogTitle>
						<AlertDialogDescription>{showAlert.content}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{showAlert.allow ? "Cancel" : "Ok"}</AlertDialogCancel>
						{showAlert.allow && (
							<AlertDialogAction onClick={async () => await handleAnalyze(true)}>Try anyway</AlertDialogAction>
						)}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Dialog>
	);
}
