import { genAI, safetySettings } from "@/gemini";
import { prisma } from "@/prisma/client";
import { Character } from "@prisma/client";
import { NextResponse } from "next/server";

type ChatMessage = {
    characterId: number;
    history: {
        role: "model" | "user";
        message: string;
    }[];
    newMessage: string;
};

const instructions = (
    character: Character & {
        events: {
            plotEvent: {
                eventSummary: string;
                involved: {
                    character: {
                        characterName: string;
                    };
                }[];
            };
        }[];
        book: {
            shortSummary: string;
        };
    }
) =>
    `
You will receive detailed information about a character from a book, along with a chat history between the user and this character.
Your task is to fully become this character, embodying their unique personality, opinions, and quirks in every response. Avoid sounding
like an AI or like you’re answering politely—respond as if you are this character, in their own words and with their own distinct flavor.

Instructions:

Answer Naturally: Don’t deflect questions back to the user. Be direct, even if blunt or opinionated. If the character has a strong reaction, lean into it.
Speak Without Narration Cues: Respond without using narration cues like “sighs wistfully” or “ahem.” Speak directly to the user, conveying emotion through word choice alone.
Expressive Language: Show emotion through the character’s natural speaking style and avoid overly elaborate expressions or internal monologues.
Stay in Character’s Voice: Use the character’s tone, speaking style, and opinions to create immersive responses. Avoid generic politeness and conversational filler that can sound “bot-like.”
Draw on Relationships and Story Context: Refer to known events or people from the book. Bring up specific details to make the response feel lived-in and real. If other characters are mentioned,
share personal opinions or emotions about them.
Use Colorful, Character-Driven Language: Add humor, irritation, excitement, or cynicism based on the character's personality. Don’t hold back—commit fully to the character’s quirks, flaws, and biases.
Keep It Brief and Impactful: Respond with no more than 100 words, using the character’s personality to make every word count.
Example Response Style:
Answer directly and with the character’s personality in mind.
Avoid any phrases that imply curiosity about the user’s opinion; stay focused on sharing the character’s unique perspective.
Use humor, exclamations, or emotional language, if fitting for the character.
Character Background Information

Book Summary: ${character.book.shortSummary}
Character Name: ${character.characterName}
Character Tone: ${character.tone}
Character Relationships: ${character.relationships.join(", ")}
Character Traits: ${character.traits.join(", ")}
Character Goals: ${character.goals.join(", ")}
Character Quotes: ${character.quotes.join(", ")}
Notable Events: ${character.events
        .map((event) => event.plotEvent)
        .map((event) => `${event.eventSummary} `)
        .join(", ")}
`;

export async function POST(request: Request) {
    const data: ChatMessage = await request.json();

    const character = await prisma.character.findUnique({
        where: {
            id: data.characterId,
        },
        include: {
            events: {
                select: {
                    plotEvent: {
                        select: {
                            eventSummary: true,
                            involved: {
                                select: {
                                    character: true,
                                },
                            },
                        },
                    },
                },
            },
            book: {
                select: {
                    shortSummary: true,
                },
            },
        },
    });

    if (!character)
        return NextResponse.json(
            { message: "No character found" },
            { status: 404 }
        );

    character.events.forEach((event) =>
        event.plotEvent.involved.forEach((char) => char.character.characterName)
    );

    console.log(instructions(character));

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "text/plain",
            // ~ 120 words
            maxOutputTokens: 160,

            // Keeps responses fairly focused on the provided details but allows for enough variability to make the character feel lively and interesting.
            // If consistency is more important than unpredictability, 0.7 is a safe bet.
            temperature: 0.7,
        },
        safetySettings,
        systemInstruction: instructions(character),
    });

    const chatSession = model.startChat({
        history: data.history.map((message) => ({
            parts: [
                {
                    text: message.message,
                },
            ],
            role: message.role,
        })),
    });

    const { stream: upstreamResponse } = await chatSession.sendMessageStream(
        data.newMessage
    );

    const stream = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of upstreamResponse) {
                    // Convert the chunk to text and enqueue it to the ReadableStream
                    const chunkText = chunk.text();
                    controller.enqueue(new TextEncoder().encode(chunkText));
                }
            } catch (error) {
                console.error("Error streaming data:", error);
                controller.error(error);
            } finally {
                controller.close();
            }
        },
    });

    return new NextResponse(stream, {
        headers: { "Content-Type": "text/event-stream" },
    });
}
