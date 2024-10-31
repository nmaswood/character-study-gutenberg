import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// export const getBookMetadataLink = (bookId: string): string =>
//     `https://www.gutenberg.org/ebooks/${bookId}`;
export const getBookMirrorDownloadLinks = (bookId: string): string[] => {
	const bookIdNumber = parseInt(bookId, 10);

	// turns 1787 -> 1/7/8/1787/1787
	// this is how the mirror structures files
	const urlPostFix = Array.from(bookId.slice(0, bookId.length - 1)).join("/") + "/" + bookIdNumber + "/" + bookIdNumber;

	return [
		`https://www.mirrorservice.org/sites/ftp.ibiblio.org/pub/docs/books/gutenberg/${urlPostFix}.txt`,
		`https://www.mirrorservice.org/sites/ftp.ibiblio.org/pub/docs/books/gutenberg/${urlPostFix}-0.txt`,
	];
};

export const getGutendexLink = (bookId: string): string => {
	return `https://gutendex.com/books/${bookId}`;
};

const userAgents = [
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/89.0",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Safari/605.1.15",
];

export const getRandomUserAgent = () => {
	return userAgents[Math.floor(Math.random() * userAgents.length)];
};

export const formatNumber = (num: number): string => {
	if (num >= 1_000_000) {
		return `${(num / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
	}
	if (num >= 1_000) {
		return `${(num / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
	}
	return num.toString();
};
