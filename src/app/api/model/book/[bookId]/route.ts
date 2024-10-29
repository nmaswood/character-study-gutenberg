import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";
import { AnalyzeBookResponse } from "../analyze/route";

export async function GET(request: Request): Promise<NextResponse> {
    const url = new URL(request.url);
    const bookId = url.pathname.split("/").pop();

    const book = await prisma.book.findUnique({
        where: {
            id: bookId,
        },
        include: {
            characters: true,
            plotEvents: true,
        },
    });

    if (!book) {
        return new NextResponse(null, { status: 404 });
    }

    return NextResponse.json<AnalyzeBookResponse>({
        characters: book.characters.map((character) => ({
            id: character.id,
            characterName: character.characterName,
            quotes: character.quotes,
        })),
        shortSummary: book.shortSummary,
    });
}
