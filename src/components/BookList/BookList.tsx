"use client";

import { useBookStore } from "@/stores/useBookStore";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import BookListItem from "./BookListItem";

export default function BookList() {
  const { localBooks, removeBook, _hasHydrated } = useBookStore();

  if (!_hasHydrated) return <>loading</>;

  return (
    <div className="min-h-[300px] divide-y divide-solid rounded-t-lg px-10 py-8">
      <div className="flex flex-row items-center justify-between pb-2">
        <div className="text-xl font-bold">Local Library</div>
        <div>{localBooks.length} book(s) found</div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit">ID</TableHead>
            <TableHead className="w-[200px]">Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Saved Date</TableHead>
            <TableHead>Language</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!_hasHydrated ? (
            <>loading</>
          ) : (
            localBooks.map((book) => <BookListItem key={book.id} book={book} onDelete={removeBook} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
}
