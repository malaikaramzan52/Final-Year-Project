import { server } from "../server";

const backendOrigin = (server || "http://localhost:5000").replace(/\/$/, "");

/**
 * Resolves an image path to a full URL.
 * External URLs pass through; local paths get the backend origin prepended.
 */
const resolveImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  // Local upload path like /uploads/filename.jpg
  return `${backendOrigin}${img.startsWith("/") ? img : `/${img}`}`;
};

/**
 * Normalizes a book object from the API to match the shape
 * that frontend components expect (image_Url array, name field, etc.)
 */
export const normalizeBook = (book) => {
  if (!book) return null;

  const id = book._id || book.id;
  const imageUrl = resolveImage(book.image);

  return {
    ...book,
    id,
    _id: id,
    // Components access book.name everywhere
    name: book.title || book.name || "",
    title: book.title || book.name || "",
    // Components access book.image_Url[0].url
    image_Url: imageUrl ? [{ url: imageUrl }] : [],
    image: imageUrl,
    // Map populated category to string for display
    category: book.category?.name || book.category || "",
    categoryId: book.category?._id || book.category,
    // Map populated user to shop-like shape for ProductDetails seller info
    shop: book.user?.name
      ? {
          name: book.user.name,
          shop_avatar: { url: resolveImage(book.user.avatar) },
          email: book.user.email || "",
          createdAt: book.user.createdAt || "",
        }
      : book.shop,
    // Preserve seller user ID
    sellerId: book.user?._id || book.user,
  };
};

export const normalizeBooks = (books) =>
  (books || []).map(normalizeBook);
