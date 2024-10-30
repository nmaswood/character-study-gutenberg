import { useState, useMemo, useEffect, useRef } from "react";

export const useBookReader = (bookContent: string, WORDS_PER_PAGE: number = 200) => {
	const [currentPageNumber, setCurrentPageNumber] = useState(0);

	const [showReader, setShowReader] = useState(false);

	const [currentPage, setCurrentPage] = useState(
		bookContent
			.split(" ")
			.slice(currentPageNumber * WORDS_PER_PAGE, WORDS_PER_PAGE)
			.join(" "),
	);

	const pageStartRef = useRef<null | HTMLDivElement>(null);

	const wordsInBook = useMemo(() => bookContent.split(" ").length, [bookContent]);
	const prevPage = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setCurrentPageNumber(Math.max(0, currentPageNumber - 1));
	};

	const nextPage = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setCurrentPageNumber(Math.min(currentPageNumber + 1, Math.round(wordsInBook / WORDS_PER_PAGE)));
	};

	useEffect(() => {
		const currentPageStart = currentPageNumber * WORDS_PER_PAGE;
		const currentPageEnd = currentPageNumber * WORDS_PER_PAGE + WORDS_PER_PAGE;
		const newCurrentPage = bookContent.split(" ").slice(currentPageStart, currentPageEnd).join(" ");

		setCurrentPage(newCurrentPage);
	}, [WORDS_PER_PAGE, bookContent, currentPage, currentPageNumber]);

	const handleReaderToggle = () => setShowReader((prev) => !prev);

	return {
		currentPage,
		currentPageNumber,
		handleReaderToggle,
		nextPage,
		prevPage,
		showReader,
		pageStartRef,
	};
};
