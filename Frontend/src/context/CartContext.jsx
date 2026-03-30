
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const getBookId = (book) => book?._id || book?.id;

  // Add to Cart
  const addToCart = (book) => {
    const bookId = getBookId(book);
    if (!bookId) return;

    const normalizedBook = { ...book, id: bookId };
    const existingItem = cart.find((item) => item.id === bookId);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...normalizedBook, quantity: 1 }]);
    }
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    const targetId = typeof id === "object" ? getBookId(id) : id;
    setCart(cart.filter((item) => item.id !== targetId));
  };





  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
