import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import BestDeals from "../components/Root/BestDeals/BestDeals";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get("categoryName");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header activeHeading={2} />
      
      {/* Premium Hero Banner */}
      <div 
        className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
            {categoryName ? `${categoryName} Collection` : "Browse All Books"}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto drop-shadow-sm">
            {categoryName 
              ? `Discover the finest selections handpicked for ${categoryName.toLowerCase()} enthusiasts.`
              : "Explore our vast collection of vintage, rare, and exchangeable books from around the globe."}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-8">
        <BestDeals isPage={true} />
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
