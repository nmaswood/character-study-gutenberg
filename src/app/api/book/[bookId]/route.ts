import { axiosClient } from "@/lib/axios-client";
import { getBookMirrorDownloadLinks, getRandomUserAgent } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const bookId = url.pathname.split("/").pop() as string;
	const bookDownloadLinks = getBookMirrorDownloadLinks(bookId);

	for (const link of bookDownloadLinks) {
		try {
			const response = await axiosClient.get(link, {
				timeout: 1000000,
				headers: {
					"User-Agent": getRandomUserAgent(),
					Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
					"Accept-Encoding": "gzip, deflate, br",
					"Accept-Language": "en-US,en;q=0.9",
					Connection: "keep-alive",
				},
			});

			return new NextResponse(response.data);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error({
					error: {
						cause: error.cause,
						code: error.code,
					},
				});

				continue;
			}
		}
	}

	return NextResponse.json({ message: "failed" }, { status: 404 });
}
