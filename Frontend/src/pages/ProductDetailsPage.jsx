import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import api from "../api/axios";
import { normalizeBook } from "../utils/normalizeBook";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/v2/book/${id}`);
        setBook(normalizeBook(res.data.book));
      } catch (err) {
        console.error("Failed to fetch book:", err);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-4 border-[#D98C00] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : book ? (
            <>
              <ProductDetails book={book} />
              <SuggestedProduct book={book} />
            </>
          ) : (
            <div className="text-center py-24 text-gray-500">
              Book not found.
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProductDetailsPage;
