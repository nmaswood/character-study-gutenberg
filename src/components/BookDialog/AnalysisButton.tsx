import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading-spinner";

const messages = [
	"Deciphering author’s personal notes",
	"Alphabetically sorting pet names",
	"Daydreaming while pretending to read the book",
	"Checking for secret messages in the margins",
	"Folding imaginary corners on pages",
	"Annotating everything in invisible ink",
	"Rearranging chapter order for dramatic effect",
	"Rewriting all nouns as pirate slang",
	"Attempting to read while upside down",
	"Removing any and all plot spoilers",
	"Translating text to ancient runes (and back)",
	"Reimagining story as a musical",
	"Replacing verbs with emojis 🕵️‍♂️",
	"Checking if protagonists like pineapple on pizza",
	"Skipping the boring parts (don’t tell!)",
	"Redoing plot in haiku form",
	"Organizing character outfits by color",
	"Searching for suspiciously similar twin characters",
	"Recasting characters as animals",
	"Identifying if characters would win at trivia",
	"Determining if villains would do stand-up comedy",
	"Debating main character’s life choices",
	"Mentally inserting plot twists at random",
	"Recasting entire book as a mystery thriller",
	"Adding more exclamation points to dialogue!!!",
	"Testing if the hero can sing opera",
	"Rephrasing dialogue in pirate lingo",
	"Adding plot twists in every third paragraph",
	"Renaming the main character to 'Gary'",
	"Asking every character their astrological sign",
];

const AnalysisButton = ({
	isAnalyzing,
	onAnalyzeButtonClick,
}: {
	isAnalyzing: boolean;
	onAnalyzeButtonClick: () => Promise<void>;
}) => {
	const [count, setCount] = useState(0);
	const [currentMessage, setCurrentMessage] = useState(messages[Math.floor(Math.random() * messages.length)]);
	const [remainingMessages, setRemainingMessages] = useState(messages);

	const handleAnalyze = () => {
		return async (e: React.MouseEvent<HTMLElement>) => {
			e.preventDefault();
			await onAnalyzeButtonClick();
		};
	};

	useEffect(() => {
		if (remainingMessages.length === 0) return;

		const updateMessage = () => {
			const randomIndex = Math.floor(Math.random() * remainingMessages.length);
			const newMessage = remainingMessages[randomIndex];
			setCurrentMessage(`${newMessage}`);

			setRemainingMessages((prevMessages) => prevMessages.filter((_, i) => i !== randomIndex));
		};

		const updateMessageInterval = setInterval(updateMessage, 3000 + Math.random() * 2000);

		// Increment count every 100ms to simulate "loading" progress
		const updateCountInterval = setInterval(() => {
			setCount((prevCount) => Math.round((prevCount + 0.1) * 10) / 10);
		}, 100);

		return () => {
			clearInterval(updateMessageInterval);
			clearInterval(updateCountInterval);
		};
	}, [remainingMessages]);

	return (
		<div className="flex flex-row items-center justify-center pr-4 pt-4 text-left">
			<Button
				type="button"
				disabled={isAnalyzing}
				onClick={handleAnalyze()}
				className={`md:disable:flex-row align-self-center flex min-w-fit transition-all duration-300 disabled:min-w-fit disabled:max-w-[450px] disabled:items-center disabled:justify-start disabled:whitespace-normal disabled:bg-transparent disabled:py-4 disabled:text-left disabled:text-white disabled:opacity-100 disabled:shadow-none md:flex md:disabled:bg-[#8f8053]`}
			>
				{isAnalyzing ? (
					<>
						<LoadingSpinner />
						{currentMessage} {count.toFixed(1)}(s)
					</>
				) : (
					"Analyze Book"
				)}
			</Button>
		</div>
	);
};

export default AnalysisButton;
