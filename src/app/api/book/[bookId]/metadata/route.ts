import { getGutendexLink, getRandomUserAgent } from "@/lib/utils";
import { FetchedBook } from "@/stores/useBookStore";
import axios from "axios";
import { NextResponse } from "next/server";

type BookMetadataResponse = {
    id: number;
    title: string;
    authors: {
        name: string;
        birth_year: number | null;
        death_year: number | null;
    }[];
    translators: {
        name: string;
        birth_year?: number | null;
        death_year?: number | null;
    }[];
    subjects: string[];
    bookshelves: string[];
    languages: string[];
    copyright: boolean;
    media_type: string;
    formats: {
        [format: string]: string;
    };
    download_count: number;
};

export async function GET(request: Request) {
    const url = new URL(request.url);
    const bookId = url.pathname.split("/")[url.pathname.split("/").length - 2];
    const metaDataLink = getGutendexLink(bookId);

    try {
        const response = await axios.get(metaDataLink, {
            headers: {
                "User-Agent": getRandomUserAgent(),
                Connection: "keep-alive",
            },
        });

        const bookMetaDataResponse: BookMetadataResponse = response.data;

        const bookMetaData: FetchedBook = {
            ...bookMetaDataResponse,
            id: String(bookMetaDataResponse.id),
        };

        return NextResponse.json(bookMetaData);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log({
                error: {
                    cause: error.cause,
                    code: error.code,
                    errors: error.stack,
                },
            });

            if (error.response?.status === 404)
                return NextResponse.json(
                    { message: "Book not found" },
                    { status: 404 }
                );

            return NextResponse.json(
                {
                    message: `Failed to fetch book metadata for ${bookId}`,
                    error: {
                        cause: error.cause,
                        code: error.code,
                        message: error.message,
                    },
                },
                { status: 500 }
            );
        }
    }
}
