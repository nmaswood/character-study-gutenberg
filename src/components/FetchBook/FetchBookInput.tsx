"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetchBook from "../../app/hooks/useFetchBook";
import { Search } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";

export default function FetchBookInput() {
	const { bookId, onBookIdChange, fetchBookMetadata, loading } = useFetchBook();

	return (
		<form
			className="flex w-full min-w-full items-center justify-center gap-x-10 space-x-2 px-2"
			onSubmit={async (e) => {
				e.preventDefault();

				await fetchBookMetadata();
			}}
		>
			<div className="relative w-96 rounded-lg bg-gray-800">
				{/* Pink blur background covering the entire input area, including the button */}
				<div className="absolute inset-0 z-[-1] rounded-lg bg-pink-200 opacity-75 blur-sm" />

				<div className="relative flex items-center">
					<div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
						<Search className="h-5 w-5 text-gray-200" />
					</div>

					{/* Input field */}
					<Input
						className="w-full rounded-lg border-none py-4 pl-10 pr-16 text-white focus:border-blue-300"
						type="search"
						placeholder="Book ID"
						onChange={onBookIdChange}
						value={bookId}
					/>

					{/* Button */}
					<Button
						className="absolute inset-y-0 right-0 flex items-center rounded-r-lg px-4"
						type="submit"
						disabled={loading || bookId === ""}
					>
						Fetch Book {loading && <LoadingSpinner />}
					</Button>
				</div>
			</div>
		</form>
	);
}
