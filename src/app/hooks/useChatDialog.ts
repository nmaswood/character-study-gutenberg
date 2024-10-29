import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useMemo, useState } from "react";
import { Character } from "./useBookDialog";

export const useChatDialog = (character: Character) => {
    const [messageContent, setMessageContent] = useState("");
    const [currentResponse, setCurrentResponse] = useState("");
    const [streamingResponse, setStreamingResponse] = useState(false);

    const [characterName, setCharacterName] = useState(character.characterName);
    const [characterQuote, setCharacterQuote] = useState(
        character.quotes[Math.floor(Math.random() * character.quotes.length)]
    );

    const { userChats, createChat, updateChatHistory, clearHistory } =
        useChatStore();

    useEffect(() => {
        setCharacterName(character.characterName);
        setCharacterQuote(
            character.quotes[
                Math.floor(Math.random() * character.quotes.length)
            ]
        );
    }, [character]);

    const handleMessageContentUpdate = (messageContent: string) => {
        setMessageContent(messageContent);
    };

    const handleClearHistory = () => clearHistory(character.id);

    const chatHistory = useMemo(() => {
        return (
            userChats.find((chat) => chat.characterId === character.id)
                ?.history || []
        );
    }, [character.id, userChats]);

    const handleSendMessage = async () => {
        if (messageContent.trim() === "") return;

        const newMessage = messageContent;

        if (chatHistory.length === 0) {
            createChat({
                characterId: character.id,
                history: [
                    {
                        role: "user",
                        message: newMessage,
                    },
                ],
            });
        } else
            updateChatHistory({
                characterId: character.id,
                message: newMessage,
                role: "user",
            });

        // Clear the input
        handleMessageContentUpdate("");

        try {
            setStreamingResponse(true);

            const response = await fetch("/api/model/chat", {
                method: "POST",
                body: JSON.stringify({
                    characterId: character.id,
                    history: chatHistory,
                    newMessage: newMessage,
                }),
            });

            if (!response.body) throw new Error("ReadableStream not supported");

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let streamText = "";

            // Read the stream chunk by chunk
            while (true) {
                const { value, done } = await reader.read();

                if (done) break;

                // Decode the chunk and process it
                const chunkText = decoder.decode(value, { stream: true });
                streamText += chunkText;
                setCurrentResponse(streamText);
                console.log("Chunk received:", chunkText); // Process each chunk as it arrives
            }

            updateChatHistory({
                characterId: character.id,
                role: "model",
                message: streamText,
            });

            setCurrentResponse("");
            console.log("Full Stream Text:", streamText); // Optional: After the entire stream is received
        } catch (error) {
            console.error("Error fetching stream:", error);
        } finally {
            setStreamingResponse(false);
        }
    };

    return {
        characterName,
        characterQuote,
        chatHistory,
        createChat,
        currentResponse,
        handleClearHistory,
        handleMessageContentUpdate,
        handleSendMessage,
        messageContent,
        streamingResponse,
    };
};
