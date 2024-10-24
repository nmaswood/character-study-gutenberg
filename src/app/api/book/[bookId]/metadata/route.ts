import { getBookMetadataLink } from "@/lib/utils";
import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const bookId = url.pathname.split("/")[url.pathname.split("/").length - 2];
    const metaDataLink = getBookMetadataLink(bookId);

    // xray(
    //     metaDataLink,
    //     "title"
    // )(function (err, title) {
    //     console.log(title); // Google
    // });

    // try {
    //     const response = await axios.get(metaDataLink, {
    //         timeout: 1000000,
    //         httpsAgent: new https.Agent({
    //             keepAlive: true,
    //             timeout: 60000,
    //             scheduling: "fifo",
    //         }),
    //         headers: {
    //             "User-Agent":
    //                 "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    //             Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    //             "Accept-Encoding": "gzip, deflate, br",
    //             "Accept-Language": "en-US,en;q=0.9",
    //             Connection: "keep-alive",
    //         },
    //     });

    //     if (response.status !== 200) {
    //         return NextResponse.json(
    //             { message: "Book not found" },
    //             { status: 404 }
    //         );
    //     }
    // } catch (error) {
    //     if (axios.isAxiosError(error)) {
    //         console.log({
    //             error: {
    //                 cause: error.cause,
    //                 code: error.code,
    //                 errors: error.stack,
    //             },
    //         });
    //         return NextResponse.json(
    //             {
    //                 message: `Failed to fetch book metadata for ${bookId}`,
    //                 error: {
    //                     cause: error.cause,
    //                     code: error.code,
    //                     message: error.message,
    //                 },
    //             },
    //             { status: 500 }
    //         );
    //     }
    // }

    return NextResponse.json({ message: bookId });
}
