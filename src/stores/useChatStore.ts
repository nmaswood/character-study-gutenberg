import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ChatMessage = {
	role: string;
	message: string;
};

export type Chat = {
	characterId: number;
	history: ChatMessage[];
};

export type ChatUpdate = {
	characterId: number;
	role: "model" | "user";
	message: string;
};

type ChatState = {
	userChats: Chat[];
};

type ChatAction = {
	createChat: (chat: Chat) => void;
	updateChatHistory: (chatUpdate: ChatUpdate) => void;
	clearHistory: (characterId: number) => void;
};

export const useChatStore = create<ChatState & ChatAction>()(
	persist(
		(set) => ({
			userChats: [],
			createChat: (chat: Chat) => {
				set((state) => ({
					...state,
					userChats: [...state.userChats, chat],
				}));
			},
			updateChatHistory: (chatUpdate: ChatUpdate) => {
				set((state) => ({
					...state,
					userChats: state.userChats.map((chat) => {
						if (chat.characterId === chatUpdate.characterId) {
							return {
								...chat,
								history: [...chat.history, chatUpdate],
							};
						}
						return chat;
					}),
				}));
			},
			clearHistory: (characterId: number) => {
				set((state) => ({
					...state,
					userChats: state.userChats.filter((chat) => {
						if (chat.characterId !== characterId) {
							return chat;
						}
					}),
				}));
			},
		}),
		{
			name: "chat-store",
			storage: createJSONStorage(() => localStorage),
		},
	),
);
