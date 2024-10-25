"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetchBookInput from "../../app/hooks/useFetchBookInput";
import { Search } from "lucide-react";

export default function FetchBookInput() {
    const { bookId, onBookIdChange, fetchBookMetadata } = useFetchBookInput();

    return (
        <div className="flex w-full max-w-sm items-center space-x-2 min-w-full gap-x-10">
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
            <Button
                type="submit"
                onClick={async (e) => {
                    e.preventDefault();
                    await fetchBookMetadata();
                }}
            >
                Fetch Book
            </Button>
        </div>
    );
}
