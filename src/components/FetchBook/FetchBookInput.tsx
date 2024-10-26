"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetchBook from "../../app/hooks/useFetchBook";
import { Search } from "lucide-react";
import { LoadingSpinner } from "../ui/loading-spinner";

export default function FetchBookInput() {
    const { bookId, onBookIdChange, fetchBookMetadata, loading } =
        useFetchBook();

    return (
        <form
            className="flex w-full max-w-sm items-center justify-center space-x-2 min-w-full gap-x-10 border-4"
            onSubmit={async (e) => {
                e.preventDefault();
                await fetchBookMetadata();
            }}
        >
            <div className="relative w-full max-w-md">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-900" />
                </div>

                <Input
                    className="pl-10"
                    type="search"
                    placeholder="Book ID"
                    onChange={onBookIdChange}
                    value={bookId}
                />
            </div>
            <Button type="submit" disabled={loading}>
                Fetch Book {loading && <LoadingSpinner />}
            </Button>
        </form>
    );
}
