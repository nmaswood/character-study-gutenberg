import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useMemo, useState } from "react";
import { Character } from "./useBookDialog";

export const useChatDialog = (character: Character) => {
    const [messageContent, setMessageContent] = useState("");

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

    const handleSendMessage = () => {
        if (messageContent.trim() === "") return;

        if (chatHistory.length === 0) {
            createChat({
                characterId: character.id,
                history: [
                    {
                        role: "user",
                        message: messageContent,
                    },
                ],
            });
        } else
            updateChatHistory({
                characterId: character.id,
                message: messageContent,
                role: "user",
            });

        handleMessageContentUpdate("");
    };

    return {
        characterName,
        characterQuote,
        chatHistory,
        createChat,
        handleClearHistory,
        handleMessageContentUpdate,
        handleSendMessage,
        messageContent,
    };
};
