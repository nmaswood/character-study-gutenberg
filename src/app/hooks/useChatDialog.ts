import { useChatStore } from "@/stores/useChatStore";
import { useMemo } from "react";
import { Character } from "./useBookDialog";

export const useChatDialog = (character: Character) => {
    const { userChats, createChat, updateChatHistory, clearHistory } =
        useChatStore();

    const chatHistory = useMemo(() => {
        return userChats.find((chat) => chat.characterId === 1)?.history || [];
    }, [userChats]);

    const sendMessage = (message: string) => {
        if (chatHistory.length === 0) {
            createChat({
                characterId: character.id,
                history: [
                    {
                        role: "user",
                        message: message,
                    },
                ],
            });
        } else
            updateChatHistory({
                characterId: character.id,
                message: message,
                role: "user",
            });
    };

    return {
        sendMessage,
        chatHistory,
        clearHistory,
        createChat,
    };
};
