import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// export const getBookMetadataLink = (bookId: string): string =>
//     `https://www.gutenberg.org/ebooks/${bookId}`;

export const getBookMirrorDownloadLinks = (bookId: string): string[] => {
    const bookIdNumber = parseInt(bookId, 10);
    if (isNaN(bookIdNumber)) {
    }
    let num = bookIdNumber;
    let urlPostFix = "";
    while (num > 0) {
        const lastNum = num % 10;
        num = (num - lastNum) / 10;
        console.log({ lastNum, num, bookIdNumber });

        urlPostFix += lastNum;
    }

    urlPostFix =
        Array.from(urlPostFix.slice(1, urlPostFix.length)).reverse().join("/") +
        "/" +
        bookIdNumber +
        "/" +
        bookIdNumber;

    console.log(urlPostFix);

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
