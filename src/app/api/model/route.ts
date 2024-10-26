import { genAI } from "@/lib/gemini";
import { LoadedBook } from "@/stores/useBookStore";
import { SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

const schema = {
    description: "List of characters",
    type: SchemaType.ARRAY,
    items: {
        type: SchemaType.OBJECT,
        properties: {
            characterName: {
                type: SchemaType.STRING,
                description: "Name of Character",
                nullable: false,
            },
        },
        required: ["characterName"],
    },
};

export async function POST(request: Request) {
    const data = await request.json();

    const book: LoadedBook = data;

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: schema,
        },
        systemInstruction: `You will receive a book in json format. The content of the book is in the 'bookContent' field. 
        Identify every relevant/important character that you can find in the following text.
        You will then represent and play the role of each character, given that information, select characters that have strong opinions and relevance.`,
    });

    const result = await model.generateContent(JSON.stringify(book));

    console.log(result.response.usageMetadata);
    return NextResponse.json({ response: result.response.text() });
}
