"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useFetchBookInput from "../hooks/useFetchBookInput";

export default function FetchBookInput() {
    const { bookId, onBookIdChange, bookFound } = useFetchBookInput();

    return (
        <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
                type="search "
                placeholder="Book ID"
                onChange={onBookIdChange}
                value={bookId}
            />
            <Button type="submit" disabled={!bookFound}>
                Fetch Book
            </Button>
        </div>
    );
}
