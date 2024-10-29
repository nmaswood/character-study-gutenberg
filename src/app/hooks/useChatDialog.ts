import { useChatStore } from "@/stores/useChatStore";
import { useMemo } from "react";
import { Character } from "./useBookDialog";
import useSWR, { preload } from "swr";
import axios from "axios";
import { CharacterResponse } from "../api/character/[characterId]/route";

const axiosGetter = async (url: string) =>
    await axios.get(url).then((response) => response.data as CharacterResponse);

export const handlePreload = (id: number) =>
    preload("/api/character/" + id, axiosGetter);

export const useChatDialog = (character: Character) => {
    const { data: characterData, isLoading: characterLoading } = useSWR(
        "/api/character/" + character.id,
        axiosGetter
    );

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
        handlePreload,
        chatHistory,
        clearHistory,
        createChat,
        characterLoading,
        characterData,
    };
};
