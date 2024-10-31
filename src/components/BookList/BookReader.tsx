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
		<div className="w-full">
			<div className="flex w-full flex-col items-center justify-between gap-3 overflow-hidden pt-10 transition-all duration-300 md:items-start">
				<div className="flex w-full flex-row items-center justify-center gap-1">
					<Button
						type="button"
						className="hidden h-8 w-2 flex-row items-center justify-center lg:flex"
						onClick={prevPage}
					>
						<ChevronLeft />
					</Button>
					<ScrollArea
						className={`h-[250px] overflow-y-auto whitespace-pre-wrap rounded-md border p-3 text-xs md:h-[550px] md:w-5/6 md:p-4 md:text-sm ${courier.className} bg-slate-800`}
					>
						<div ref={pageStartRef} />

						{currentPage}
					</ScrollArea>
					<Button
						type="button"
						className="hidden h-8 w-2 flex-row items-center justify-center lg:flex"
						onClick={nextPage}
					>
						<ChevronRight />
					</Button>
				</div>
				<div className="flex w-full flex-row items-center justify-center gap-3 lg:hidden">
					<Button type="button" className="" onClick={prevPage}>
						<ChevronLeft />
					</Button>
					<div>Page {currentPageNumber + 1}</div>
					<Button type="button" onClick={nextPage}>
						<ChevronRight />
					</Button>
				</div>
				<Button variant={"outline"} onClick={() => handleReaderToggle()}>
					Close
				</Button>
			</div>
		</div>
	);
}
