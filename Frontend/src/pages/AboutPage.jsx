import React, { useEffect } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import bookImg from "../Assets/Book.jpg";
import bookImg1 from "../Assets/Book 1.jpg";
import bookImg2 from "../Assets/Book 2.jpg";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header activeHeading={4} />

      {/* Hero Intro Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6 drop-shadow-sm">
            Welcome to <span className="text-[#D98C00]">Rebook</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Every book has a story, and often, its journey doesn’t end with the final page. 
            At Rebook, we believe in the power of preserving knowledge, sharing stories, and fostering a community of sustainable reading. 
            Our platform connects passionate readers, giving beloved books a second life.
          </p>
          <div className="w-20 h-1 bg-[#D98C00] rounded"></div>
        </div>
        <div className="md:w-1/2 w-full">
          <img 
            src={bookImg} 
            alt="Welcome to Rebook" 
            className="w-full h-auto rounded-2xl shadow-xl transform transition duration-500 hover:scale-105 object-cover max-h-[500px]"
          />
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 px-6 bg-white w-full shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="md:w-1/2 w-full">
            <img 
              src={bookImg1} 
              alt="Our Mission" 
              className="w-full h-auto rounded-2xl shadow-xl transform transition duration-500 hover:scale-105 object-cover max-h-[500px]"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6 drop-shadow-sm">
              Our Vision & Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-4">
              We envision a world where literature remains deeply accessible. 
              Our mission is to establish a seamless, robust pre-loved book economy where students, enthusiasts, and casual readers can effortlessly discover, buy, and exchange books.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              By promoting book exchange, we help reduce paper waste and build an ecosystem where knowledge continuously flows from one reader to another.
            </p>
            <div className="w-20 h-1 bg-[#D98C00] mt-6 rounded"></div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8 drop-shadow-sm">
            Why Choose Us?
          </h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-[#D98C00]/10 rounded-full flex items-center justify-center border border-[#D98C00]/30 mr-5">
                <svg className="w-7 h-7 text-[#D98C00]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Vast Collection</h3>
                <p className="text-gray-600 mt-2 text-lg">Easily find rare, vintage, and academic books across thousands of categories.</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-[#D98C00]/10 rounded-full flex items-center justify-center border border-[#D98C00]/30 mr-5">
               <svg className="w-7 h-7 text-[#D98C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Seamless Exchanges</h3>
                <p className="text-gray-600 mt-2 text-lg">Our dynamic platform empowers you to safely request, propose, and finalize book exchanges instantly.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-14 h-14 bg-[#D98C00]/10 rounded-full flex items-center justify-center border border-[#D98C00]/30 mr-5">
                <svg className="w-7 h-7 text-[#D98C00]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Community Validated</h3>
                <p className="text-gray-600 mt-2 text-lg">Experience shopping with integrity driven by robust user reviews and secure handling.</p>
              </div>
            </div>

          </div>
        </div>
        <div className="md:w-1/2 w-full">
          <img 
            src={bookImg2} 
            alt="Why Choose Us" 
            className="w-full h-auto rounded-2xl shadow-xl transform transition duration-500 hover:scale-105 object-cover max-h-[500px]"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
