import useFetchBook from "@/app/hooks/useFetchBook";
import { BookIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading-spinner";
import { TableRow, TableCell } from "../ui/table";
import { Book } from "@/stores/useBookStore";

export default function BookListItem({ book, onDelete }: { book: Book; onDelete: (bookId: string) => void }) {
  const { openBook, loadingBookContent } = useFetchBook();

  const handleDelete = (bookId: string) => {
    return (_e: React.MouseEvent) => {
      _e.preventDefault();
      onDelete(bookId);
    };
  };

  return (
    <TableRow>
      <TableCell className="w-fit font-thin">{book.id}</TableCell>
      <TableCell className="max-w-4 truncate font-medium">{book.title}</TableCell>
      <TableCell className="">{book.authors}</TableCell>
      <TableCell>{new Date(book.fetchDate).toUTCString()}</TableCell>
      <TableCell>{book.languages.join(", ")}</TableCell>
      <TableCell className="flex flex-row items-center justify-end gap-2">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            openBook(book.id);
          }}
        >
          {loadingBookContent ? <LoadingSpinner /> : "Open"} <BookIcon />
        </Button>
        <Button variant="destructive" onClick={handleDelete(book.id)}>
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
}
