import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import ProductCard from "../Root/ProductCard/ProductCard";
import api from "../../api/axios";
import { normalizeBooks } from "../../utils/normalizeBook";

const SuggestedProduct = ({ book }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (book && book.categoryId) {
      const fetchRelated = async () => {
        try {
          const res = await api.get(`/v2/book/category/${book.categoryId}`);
          // Filter out the current book
          const related = normalizeBooks(res.data.books).filter(
            (b) => b.id !== book.id && b._id !== book._id
          );
          setProducts(related);
        } catch (err) {
          console.error("Failed to fetch related books:", err);
        }
      };
      fetchRelated();
    }
  }, [book]);

  if (!products.length) return null;

  return (
    <div>
      <div className={`p-4 ${styles.section}`}>
        <h2
          className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}
        >
          Related Books
        </h2>

        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
          {products.map((item) => (
            <ProductCard book={item} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedProduct;
