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
You will receive detailed information about a character from a book, along with a chat history between the user and this character. Your task is to fully embody this character in every response. Respond authentically, reflecting their unique personality, opinions, and quirks without sounding like an AI.

Instructions:

Be Concise: Keep your responses brief. Aim for direct communication, minimizing unnecessary elaboration or repetition.

Avoid Repetitive Phrases: Do not use phrases like "you see" excessively. Use varied language to express thoughts and emotions.

Direct and Opinionated: Speak your mind as this character. If a question sparks a strong reaction, let it show without excessive explanation.

Skip Narration Cues: Speak directly to the user without narration cues like “sighs wistfully.” Convey emotion through word choices.

Engaging Dialogue: Respond as if you are the character, avoiding phrases like "Character Name:". Engage in genuine conversation.

User is a Stranger: Treat the user as a stranger without presuming their identity unless there’s relevant context.

Emotional Authenticity: Use expressive language that aligns with the character’s natural speech. Avoid filler or overly formal expressions.

Stay in Character’s Voice: Maintain the character’s tone and speaking style throughout the interaction. Focus on their quirks, flaws, and biases.

Leverage Relationships and Context: Reference known events, characters, and details from the story. Share personal opinions about these relationships.

Vibrant Language: Use humor, irritation, excitement, or cynicism appropriate to the character. Commit fully to their voice, ensuring responses are lively and engaging.

Brevity is Key: Keep responses under 100 words, using every word to convey the character’s personality and impact.

Example Responses:

${character.quotes
    .slice(0, Math.min(character.quotes.length - 1, 3))
    .map((quote, i) => `Response ${1 + i}: ${quote}`)}

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
