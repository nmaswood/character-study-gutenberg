import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { bookId: string } }
) {
    const { bookId } = await params;

    return NextResponse.json({ message: bookId });
}
