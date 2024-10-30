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
import ChatDialog from "./ChatDialog";
import { courier } from "../fonts";
import { MessageCircleMore, MessageCirclePlus } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore";
import AnalysisButton from "./AnalysisButton";

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

	const { userChats } = useChatStore();

	const handleAnalyze = async () => {
		await analyzeBook(openedBook!);
	};

	if (!openedBook) return <></>;

	return (
		<Dialog open={openedBook !== null} onOpenChange={onOpenChange}>
			<DialogContent
				className={`md:min-h-1/2 flex max-h-[750px] pr-12 transition-all duration-100 md:min-w-[800px] ${
					isChatOpen ? "sm:max-w-[80vw]" : "sm:max-w-1/2"
				}`}
			>
				{/* Left section - Book details */}
				<div className={`flex-1 overflow-auto px-2 md:block ${isChatOpen ? "hidden md:block md:border-r" : ""}`}>
					<DialogHeader>
						<DialogTitle>
							<div>
								<div className="inline text-xl">{openedBook.title + " "}</div>
								<div className="inline text-lg"> by {openedBook.authors}</div>
							</div>
						</DialogTitle>
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
										<span className="text-lg font-bold sm:text-3xl">{formatNumber(totalCount[i])}</span>
									</div>
								))}
							</div>
						</div>

						{/* If analyzed, show book summary */}
						<div className="divide-y-4 divide-double">
							{openedBook.isAnalyzed ? (
								<div className="flex flex-col gap-8 pt-8">
									<div className="grid w-full grid-flow-row grid-cols-2 gap-3 md:grid-cols-3 md:gap-2">
										{openedBook.characters?.map((character, i) => (
											<Button type="button" onClick={() => handleChatOpen(character)} key={i}>
												{userChats.find((ch) => ch.characterId === character.id) ? (
													<MessageCircleMore />
												) : (
													<MessageCirclePlus />
												)}
												{character.characterName}
											</Button>
										))}
									</div>
								</div>
							) : (
								<div className="flex flex-row items-center justify-start pr-4 pt-4 text-left">
									<AnalysisButton isAnalyzing={!isAnalyzing} onAnalyzeButtonClick={handleAnalyze} />
								</div>
							)}
						</div>
						<DialogDescription>{/* Additional content like the book's metadata or summary */}</DialogDescription>
					</DialogHeader>
					<BookReader bookContent={openedBook.bookContent} />
				</div>

				{/* Right section - Chat panel, only visible when a character is selected */}
				{isChatOpen && activeCharacter && (
					<ChatDialog activeCharacter={activeCharacter} handleCloseChat={handleCloseChat} />
				)}
			</DialogContent>
			<DialogFooter>{/* Footer if needed */}</DialogFooter>
		</Dialog>
	);
}

// const ChatSummaryWithLinks = ({
//     shortSummary,
//     characters,
//     onCharacterClick,
// }: {
//     shortSummary: string;
//     characters: Character[];
//     onCharacterClick: (character: Character) => void;
// }) => {
//     if (!shortSummary) return null;

//     const summaryElements = [];
//     let remainingText = shortSummary;

//     characters.forEach((character) => {
//         const nameIndex = remainingText.indexOf(character.characterName);

//         if (nameIndex !== -1) {
//             // Add text before the character's name
//             if (nameIndex > 0) {
//                 summaryElements.push(remainingText.slice(0, nameIndex));
//             }

//             // Add a button for the character's name
//             summaryElements.push(
//                 <Button
//                     key={character.id}
//                     variant="link"
//                     onClick={() => onCharacterClick(character)}
//                     className="p-0 text-blue-600 hover:underline"
//                 >
//                     {character.characterName}
//                 </Button>
//             );

//             // Update remainingText to continue after this character's name
//             remainingText = remainingText.slice(
//                 nameIndex + character.characterName.length
//             );
//         }
//     });

//     // Add any remaining text after processing all character names
//     if (remainingText) {
//         summaryElements.push(remainingText);
//     }

//     return <div className="font-normal italic">{summaryElements}</div>;
// };
