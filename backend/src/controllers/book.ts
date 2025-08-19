import { Request, Response } from "express";
import { supabase } from "../supabase/supabaseClient";

export const getBooks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const {
      status,
      category,
      sortBy,
      search,
      favorite,
      page = 1,
      limit = 12,
    } = req.query;

    let query = supabase
      .from("books")
      .select(`*, categories(name)`)
      .range(
        (Number(page) - 1) * Number(limit),
        Number(page) * Number(limit) - 1
      );

    if (status) {
      query = query.eq("status", status);
    }

    if (category) {
      query = query.eq("category_id", category);
    }

    if (search && String(search).trim() !== "") {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    const { data: books, error: booksError } = await query;

    if (booksError) throw new Error(booksError.message);

    if (!books.length) {
      return res.status(200).json({
        code: 200,
        status: "success",
        message: "No books found",
        data: [],
      });
    }

    const bookIds = books.map((b) => b.id);

    const { data: favorites, error: favError } = await supabase
      .from("favorites")
      .select("book_id, user_id")
      .in("book_id", bookIds);

    if (favError) throw new Error(favError.message);

    let data = await Promise.all(
      books.map(async (book) => {
        const favsForBook = favorites.filter((f) => f.book_id === book.id);
        const isFavorite = favsForBook.some((f) => f.user_id === userId);
        const favoriteCount = favsForBook.length;
        let user;

        if (book.reserved_by || book.borrowed_by) {
          const order_user = await supabase.auth.admin.getUserById(
            book.reserved_by ? book.reserved_by : book.borrowed_by
          );
          user = order_user.data.user?.email;
        }

        return {
          ...book,
          user,
          isFavorite,
          favoriteCount,
        };
      })
    );

    if (favorite) {
      data = data.filter((b) => b.isFavorite);
    }

    let sortedBooks = [...data];

    switch (sortBy) {
      case "fav_most":
        sortedBooks.sort((a, b) => b.favoriteCount - a.favoriteCount);
        break;
      case "fav_least":
        sortedBooks.sort((a, b) => a.favoriteCount - b.favoriteCount);
        break;
      case "added_new":
        sortedBooks.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "added_old":
        sortedBooks.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      default:
        sortedBooks.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Book List",
      sortedBooks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: sortedBooks.length,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const { data: book, error: bookError } = await supabase
      .from("books")
      .select(`*, categories(name)`)
      .eq("id", id)
      .single();

    if (bookError) throw new Error(bookError.message);

    const { data: favorites, error: favError } = await supabase
      .from("favorites")
      .select("book_id, user_id")
      .eq("book_id", book.id);

    if (favError) throw new Error(favError.message);

    const favsForBook = favorites.filter((f) => f.book_id === book.id);
    const isFavorite = favsForBook.some((f) => f.user_id === userId);
    const favoriteCount = favsForBook.length;

    const data = {
      ...book,
      isFavorite,
      favoriteCount,
    };

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Book Detail",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const { title, author, publisher, description, category_id } = req.body;
    const year = Number(req.body.year);

    const image = req.file?.path ?? null;

    const { data, error } = await supabase
      .from("books")
      .insert([
        {
          title,
          author,
          publisher,
          year,
          description,
          category_id,
          image,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Book created successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      publisher,
      description,
      category_id,
      status,
      oldImage,
    } = req.body;

    const year = Number(req.body.year);
    let image = oldImage;
    if (req.file) {
      image = req.file?.path ?? null;
    }

    const { data, error } = await supabase
      .from("books")
      .update({
        title,
        author,
        publisher,
        year,
        description,
        category_id,
        status,
        image,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Book updated successfully",
      data,
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("books").delete().eq("id", id);

    if (error) throw new Error(error.message);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Book deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Internal server error",
    });
  }
};

export const reserveBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const { data: returned, error: returnErr } = await supabase
      .from("borrowings")
      .select("*")
      .eq("user_id", userId)
      .is("returned_at", null)
      .maybeSingle();

    if (returnErr) throw new Error(returnErr.message);
    if (returned) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "You have to return the book first that you borrowed",
      });
    }

    const { data: book, error: findError } = await supabase
      .from("books")
      .select("*")
      .eq("id", id)
      .single();

    if (findError) throw findError;
    if (!book) {
      return res
        .status(404)
        .json({ code: 404, status: "error", message: "Book not found" });
    }

    if (book.status !== "available") {
      return res
        .status(400)
        .json({ code: 400, status: "error", message: "Book is not available" });
    }

    const { data: updatedBook, error: updateError } = await supabase
      .from("books")
      .update({
        status: "reserved",
        reserved_by: userId,
        reserved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    return res.json({
      code: 200,
      status: "success",
      message: "Book reserved successfully",
      data: updatedBook,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: err.message || "Failed to reserve book",
    });
  }
};

export const approveBorrowing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;

    const { data: returned, error: returnErr } = await supabase
      .from("borrowings")
      .select("*")
      .eq("user_id", user_id)
      .is("returned_at", null)
      .maybeSingle();

    if (returnErr) throw new Error(returnErr.message);
    if (returned) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "The user has to return the book first that he borrowed",
      });
    }

    const { data: book, error: bookErr } = await supabase
      .from("books")
      .update({
        status: "borrowed",
        reserved_by: null,
        reserved_at: null,
        borrowed_by: user_id,
        borrowed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (bookErr) throw new Error(bookErr.message);

    res.json({
      code: 200,
      status: "success",
      message: "Borrowing approved",
      data: { book },
    });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
