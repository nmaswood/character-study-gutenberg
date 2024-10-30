import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { courier } from "../fonts";
import { useBookReader } from "@/app/hooks/useBookReader";

const WORDS_PER_PAGE = 150;

export default function BookReader({ bookContent }: { bookContent: string }) {
	const { currentPageNumber, prevPage, nextPage, currentPage, showReader, handleReaderToggle, pageStartRef } =
		useBookReader(bookContent, WORDS_PER_PAGE);

	if (!showReader)
		return (
			<div className="flex w-full flex-row items-center justify-start pt-8 transition-all duration-300">
				<Button variant={"secondary"} onClick={() => handleReaderToggle()}>
					Read Book
				</Button>
			</div>
		);

	return (
		<div className="flex flex-col items-start justify-between gap-3 overflow-hidden pt-10 transition-all duration-300 lg:max-w-screen-sm">
			<ScrollArea
				className={`max-h-[524px] overflow-y-auto whitespace-pre-wrap rounded-md border p-4 text-sm ${courier.className}`}
			>
				<div ref={pageStartRef} />

				{currentPage}
			</ScrollArea>
			<div className="flex w-full flex-row items-center justify-center gap-3">
				<Button type="button" onClick={prevPage}>
					<ChevronLeft />
				</Button>
				<div>Page {currentPageNumber + 1}</div>
				<Button type="button" onClick={nextPage}>
					<ChevronRight />
				</Button>
			</div>
			<Button variant={"secondary"} onClick={() => handleReaderToggle()}>
				Close Book
			</Button>
		</div>
	);
}
