import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const BorrowingCard = ({ borrow }: { borrow: any }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col sm:flex-row items-center bg-white shadow-md rounded-lg p-4 lg:p-6 border border-gray-200">
      {/* Gambar Buku */}
      <img
        src={borrow.books.image}
        alt={borrow.books.title}
        className="w-24 h-32 object-cover rounded-md mb-4 sm:mb-0 sm:mr-6"
      />

      {/* Info */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h2 className="text-lg font-semibold">{borrow.books.title}</h2>
          <p className="text-gray-500 text-sm">
            {borrow.books.categories?.name || "Tanpa kategori"}
          </p>
          <p
            className={`px-3 py-0.5 rounded-full text-xs w-fit ${
              borrow.returned_at
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {borrow.returned_at ? "Returned" : "Borrowed"}
          </p>
          <Button
            size="sm"
            onClick={() => router.push(`/user/book-detail/${borrow.books.id}`)}
          >
            Book Detail
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Author:</span>{" "}
              {borrow.books.author}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Publisher:</span>{" "}
              {borrow.books.publisher}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Borrow Date:</span>{" "}
              {new Date(borrow.borrowed_at).toLocaleDateString("id-ID")}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Return Date:</span>{" "}
              {borrow.returned_at
                ? new Date(borrow.returned_at).toLocaleDateString("id-ID")
                : "Not returned yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
