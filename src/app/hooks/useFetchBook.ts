"use client";
import { axiosClient } from "@/lib/axios-client";
import { Book, LoadedBook, useBookStore } from "@/stores/useBookStore";
import { useBookUIStore } from "@/stores/useBookUIStore";
import axios, { HttpStatusCode } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { FetchedBook } from "../../stores/useBookStore";
import { AnalyzeBookResponse } from "../api/model/book/analyze/route";
import { Character } from "./useBookDialog";

export default function useFetchBook() {
	const [bookId, setBookId] = useState("");
	const [loading, setLoading] = useState(false);
	const [loadingBookContent, setLoadingBookContent] = useState(false);

	const { setOpenedBook } = useBookUIStore();

	const { localBooks, addBook, getBook, isLoadedBook, loadBookContent } = useBookStore();

	useEffect(() => {
		if (!loading) setBookId("");
	}, [loading]);

	const fetchBookMetadata = async () => {
		setLoading(true);

		try {
			let book: Book | FetchedBook | undefined = localBooks.find((book) => book.id === bookId);

			if (book) {
				toast.info("Book already in library");
				await openBook(bookId);
				return;
			}

			const response = await axios.get(`/api/book/${bookId}/metadata`);

			if (response.status === 404) {
				toast.error("Book could not be found");
				return;
			}

			book = response.data as FetchedBook;

			if (book) {
				toast.success("Book successfully fetched");

				addBook(book);
			}
		} catch (error) {
			toast.error("Something went wrong");

			if (axios.isAxiosError(error)) {
				console.error(error);
			}
		} finally {
			setLoading(false);
		}
	};

	const fetchBookContent = async (bookId: string): Promise<string> => {
		try {
			const bookContent = await axiosClient.get("/api/book/" + bookId).then((response) => response.data);
			return bookContent;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.status === 404) throw new Error(HttpStatusCode.NotFound.toString());

				if (error.status === 500) throw new Error(HttpStatusCode.InternalServerError.toString());
			}

			console.error(error);
			throw new Error(`Unknown error: ${error}`);
		}
	};

	const checkIfBookIsAnalyzed = async (
		bookId: string,
	): Promise<{
		isAnalyzed: boolean;
		characters?: Character[];
		shortSummary?: string;
	}> => {
		{
			try {
				const analyzedBook: AnalyzeBookResponse = (await axios.get("/api/model/book/" + bookId)).data;

				return {
					isAnalyzed: true,
					characters: analyzedBook.characters,
					shortSummary: analyzedBook.shortSummary,
				};
			} catch (error) {
				if (axios.isAxiosError(error)) {
					console.log({
						error: {
							cause: error.cause,
							code: error.code,
							message: "Book is not analyzed",
						},
					});
					if (error.code === "ERR_BAD_RESPONSE") {
						throw new Error(error.message);
					}
				}

				return { isAnalyzed: false };
			}
		}
	};

	const openBook = async (bookId: string) => {
		setLoadingBookContent(true);

		const book = getBook(bookId);
		let loadedBook: LoadedBook;

		try {
			if (!isLoadedBook(book)) {
				const bookContent = await fetchBookContent(bookId);
				loadedBook = loadBookContent(bookId, bookContent);
			} else {
				loadedBook = book;
			}

			const { isAnalyzed, characters, shortSummary } = await checkIfBookIsAnalyzed(bookId);
			if (isAnalyzed) {
				setOpenedBook({
					...loadedBook,
					isAnalyzed: true,
					characters: characters,
					shortSummary: shortSummary,
				});
			} else setOpenedBook(loadedBook);
		} catch (err: unknown | { message: string }) {
			if (err instanceof Error) {
				if (err.message === HttpStatusCode.NotFound.toString()) {
					toast.error("Uh oh...", {
						description: "The contents of this book (in particular) cannot be processed, please try another book.",
					});
				} else if (err.message === HttpStatusCode.InternalServerError.toString()) {
					toast.error("Oops", { description: "Failed to load book, please try again." });
				}
			} else if (err === HttpStatusCode.InternalServerError.toString()) {
				toast.error("Oops", { description: "Failed to load book, please try again." });
			}
		}

		setLoadingBookContent(false);
	};

	const onBookIdChange = (e: React.ChangeEvent<HTMLInputElement> & { key: string }) => {
		if (e.key == "Enter") {
			e.target.blur();
		}
		setBookId(e.target.value);
	};

	return {
		bookId,
		loading,
		loadingBookContent,
		openBook,
		onBookIdChange,
		fetchBookMetadata,
		fetchBookContent,
	};
}
