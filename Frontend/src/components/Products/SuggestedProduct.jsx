import React, { useEffect, useState } from 'react';
import { productData } from "../../static/data";
import styles from '../../styles/styles';
import ProductCard from "../Root/ProductCard/ProductCard";

const SuggestedProduct = ({ book }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (book && book.category) {
      const d = productData.filter(
        (i) => i.category === book.category
      );
      setProducts(d);
    }
  }, [book]);

  return (
    <div>
      {book && book.category && (
        <div className={`p-4 ${styles.section}`}>
          <h2 className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}>
            Related Books
          </h2>

          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
            {products.map((item) => (
          <ProductCard book={item} key={item._id} />

            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedProduct;
