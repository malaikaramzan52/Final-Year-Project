
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add to Cart
  const addToCart = (book) => {
    const existingItem = cart.find(item => item.id === book.id);

    if (existingItem) {
      setCart(
        cart.map(item =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...book, quantity: 1 }]);
    }
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
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
