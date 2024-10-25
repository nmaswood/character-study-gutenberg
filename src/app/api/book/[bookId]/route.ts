import { axiosClient } from "@/lib/axios-client";
import { getBookMetadataLinks, getGutendexLink } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const bookId = url.pathname.split("/").pop() as string;
    const metaDataLinks = getBookMetadataLinks(bookId);
    console.log({ metaDataLinks });

    for (const link of metaDataLinks) {
        try {
            const response = await axiosClient.get(link, {
                timeout: 1000000,
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "en-US,en;q=0.9",
                    Connection: "keep-alive",
                },
            });

            return NextResponse.json({ bookText: response.data });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log({
                    error: {
                        cause: error.cause,
                        code: error.code,
                    },
                });

                continue;
                // return NextResponse.json(
                //     {
                //         message: `Failed to fetch book metadata for ${bookId}`,
                //         error: {
                //             cause: error.cause,
                //             code: error.code,
                //             message: error.message,
                //         },
                //     },
                //     { status: 500 }
                // );
            }
        }
    }

    return NextResponse.json({ message: "failed" }, { status: 404 });
}

export async function GET_o(request: Request) {
    const url = new URL(request.url);
    const bookId = url.pathname.split("/").pop() as string;
    const metaDataLink = getGutendexLink(bookId);

    try {
        const response = await axiosClient.get(metaDataLink, {
            timeout: 1000000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.9",
                Connection: "keep-alive",
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log({
                error: {
                    cause: error.cause,
                    code: error.code,
                },
            });
        }
    }

    return NextResponse.json({ message: "failed" }, { status: 404 });
}
