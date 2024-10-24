import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// export const getBookMetadataLink = (bookId: string): string =>
//     `https://www.gutenberg.org/ebooks/${bookId}`;
export const getBookMetadataLink = (bookId: string): string[] => {
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
