import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const getBookId = (book) => book?._id || book?.id;

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

  const removeFromCart = (id) => {
    const targetId = typeof id === "object" ? getBookId(id) : id;
    setCart(cart.filter((item) => item.id !== targetId));
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
