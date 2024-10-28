import { genAI } from "@/gemini";
import { BookAnalysisSchema } from "@/gemini/schema";
import { prisma } from "@/prisma/client";
import { LoadedBook } from "@/stores/useBookStore";
import { Character, CharactersOnEvents, PlotEvent } from "@prisma/client";
import { NextResponse } from "next/server";

type BookAnalysisResponse = {
    characters: {
        characterName: string;
        traits: string[];
        relationships: string[];
        goals: string[];
        quotes: string[];
        tone: string;
    }[];
    plotEvents: {
        eventSummary: string;
        charactersInEvent: string[];
    }[];
    shortSummary: string;
};

export async function POST(request: Request) {
    const book: LoadedBook = await request.json();

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: BookAnalysisSchema,
        },
        systemInstruction: `You will receive a book in JSON format under the 'bookContent' field. 
        Your task is to:
        1. Identify all relevant and significant characters (maximum of five) within the content. For each character, extract and return the following details (maximum of 5 each):
        - Full name of the character.
        - A tone analysis that quantifies the character's tone, including their time period, accent, and any distinctive quirks or language choices,
          to create a detailed description that can be used to authentically capture their voice and vibe in future writing.
        - Key personality traits that distinguish the character.
        - Significant relationships with other characters, including their roles and nature of relationships.
        - Major goals, motivations, or desires that drive the character's actions.
        - Notable quotes that highlight the character's personality, motivations, or relationships.
        
        2. Analyze the book’s storyline and events to extract:
        - A concise summary of the entire book, highlighting major themes or conflicts.
        - A chronological or thematic list of significant events that drive the story forward, including the role of important characters involved in these events.
        - A list of the Full names of characters along with each event

        Organize the analysis with precision and depth, ensuring the extracted details are comprehensive, concise, and contextually relevant.

        Return the analysis in JSON format in accordance with the schema.`,
    });

    const result = await model.generateContent(JSON.stringify(book));
    const response = result.response.text();

    const data: BookAnalysisResponse = JSON.parse(response);

    const characters: Omit<Character, "id" | "bookId">[] = data.characters.map(
        (character) => ({
            characterName: character.characterName,
            goals: character.goals,
            relationships: character.relationships,
            traits: character.traits,
            tone: character.tone,
            quotes: character.quotes,
        })
    );

    const plotEvents: Omit<PlotEvent, "id" | "bookId">[] = data.plotEvents.map(
        (plotEvent) => ({
            eventSummary: plotEvent.eventSummary,
        })
    );

    const analysis = await prisma.$transaction(
        async () => {
            const savedAnalysis = await prisma.book.create({
                data: {
                    id: book.id,
                    shortSummary: data.shortSummary,
                    characters: {
                        createMany: {
                            data: characters,
                        },
                    },
                    plotEvents: {
                        createMany: {
                            data: plotEvents,
                        },
                    },
                },
                // Include the characters, plot events, and characters on events in the response.
                include: {
                    characters: true,
                    plotEvents: true,
                },
            });

            // Get the characters and plot events from the saved analysis.
            const charactersOnEvents: CharactersOnEvents[] =
                savedAnalysis.plotEvents.reduce(
                    (prev: CharactersOnEvents[], event) => {
                        const charactersInEvent = data.plotEvents.find(
                            (pEvent) =>
                                pEvent.eventSummary === event.eventSummary
                        )?.charactersInEvent;

                        if (charactersInEvent) {
                            // Get the characters in the event and create a new entry in the characters on events table for each character.
                            const currCharactersOnEvent: CharactersOnEvents[] =
                                savedAnalysis.characters.reduce(
                                    (
                                        prev: CharactersOnEvents[],
                                        currCharacter
                                    ) => {
                                        if (
                                            charactersInEvent.includes(
                                                currCharacter.characterName
                                            )
                                        )
                                            return [
                                                ...prev,
                                                {
                                                    // Link the character to the plot event.
                                                    plotEventId: event.id,
                                                    characterId:
                                                        currCharacter.id,
                                                },
                                            ];

                                        return prev;
                                    },
                                    []
                                );

                            // Add the new characters on events to the list.
                            return [...prev, ...currCharactersOnEvent];
                        }

                        return prev;
                    },
                    []
                );

            await prisma.charactersOnEvents.createMany({
                data: charactersOnEvents,
            });

            return savedAnalysis;
        },
        {
            timeout: 10000,
        }
    );

    return NextResponse.json({
        data: {
            shortSummary: analysis.shortSummary,
            characters: analysis.characters.map(
                (character) => character.characterName
            ),
        },
    });
}
