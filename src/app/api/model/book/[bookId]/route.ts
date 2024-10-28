import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

    return NextResponse.json({
        bookId: book.id,
        characters: book.characters.map((character) => character.characterName),
    });
}
