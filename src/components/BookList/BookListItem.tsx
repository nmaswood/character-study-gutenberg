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
      <TableCell className="hidden w-fit md:table-cell lg:table-cell">{book.id}</TableCell>
      <TableCell className="max-w-1 truncate text-xs font-medium md:max-w-4 md:text-sm">{book.title}</TableCell>
      <TableCell className="max-w-1 truncate text-xs font-medium md:max-w-4 md:text-sm">{book.authors}</TableCell>
      <TableCell className="hidden md:table-cell lg:table-cell">
        {new Date(book.fetchDate).toLocaleDateString()}
      </TableCell>
      <TableCell className="hidden md:table-cell lg:table-cell">{book.languages.join(", ")}</TableCell>
      <TableCell className="flex flex-row items-center justify-end gap-2 md:flex lg:flex">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            openBook(book.id);
          }}
        >
          {loadingBookContent ? <LoadingSpinner /> : <div className="hidden md:inline lg:inline">Open</div>}{" "}
          <BookIcon />
        </Button>
        <Button variant="destructive" onClick={handleDelete(book.id)}>
          <Trash2 />
        </Button>
      </TableCell>
    </TableRow>
  );
}
