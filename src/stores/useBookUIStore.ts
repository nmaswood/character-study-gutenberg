import { create } from "zustand";
import { LoadedBook } from "./useBookStore";

type BookUIState = {
	openedBook: LoadedBook | null;
};

type BookUIAction = {
	setOpenedBook: (book: LoadedBook) => void;
	closeBook: () => void;
};

export const useBookUIStore = create<BookUIState & BookUIAction>((set) => ({
	openedBook: null,
	setOpenedBook: (book: LoadedBook) => set(() => ({ openedBook: book })),
	closeBook: () => set(() => ({ openedBook: null })),
}));
