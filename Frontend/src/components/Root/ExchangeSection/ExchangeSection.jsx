import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import bookImg from "../../../Assets/Book 3.jpg";

const points = [
  {
    icon: "🔄",
    title: "List Your Book",
    desc: "Upload any book you want to exchange — set your preferred condition and category.",
  },
  {
    icon: "🔍",
    title: "Find a Match",
    desc: "Browse books listed by other readers and send an exchange request instantly.",
  },
  {
    icon: "🤝",
    title: "Agree & Exchange",
    desc: "Both parties confirm the deal. Meet up or ship the books to each other.",
  },
  {
    icon: "📖",
    title: "Read Something New",
    desc: "Enjoy your new book and keep the cycle of reading alive — for free!",
  },
];

const ExchangeSection = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-br from-[#fffbf2] to-[#fff7e0] py-20 px-6 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14">

        {/* ── Left: Image ── */}
        <div
          className={`w-full lg:w-[45%] transition-all duration-1000 ease-out ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
        >
          <div className="relative">
            {/* Decorative ring */}
            <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border-4 border-[#D98C00]/25 z-0" />
            <img
              src={bookImg}
              alt="Exchange Books"
              className="relative z-10 w-full max-h-[480px] object-cover rounded-3xl shadow-2xl"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 z-20 bg-[#D98C00] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2">
              <span className="text-xl">🔄</span>
              <span>Free Book Exchange</span>
            </div>
          </div>
        </div>

        {/* ── Right: Text & Points ── */}
        <div
          className={`w-full lg:w-[55%] transition-all duration-1000 ease-out delay-200 ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`}
        >
          {/* Label */}
          <span className="inline-block mb-3 px-4 py-1 bg-[#D98C00]/10 text-[#D98C00] text-xs font-bold uppercase tracking-widest rounded-full border border-[#D98C00]/30">
            How It Works
          </span>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Exchange Books,{" "}
            <span className="text-[#D98C00]">Not Money</span>
          </h2>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Give your books a second life. Our exchange program lets readers
            swap books they've finished for ones they haven't — completely free.
          </p>

          {/* Animated Points */}
          <div className="space-y-6">
            {points.map((pt, i) => (
              <div
                key={i}
                className={`flex items-start gap-5 transition-all duration-700 ease-out ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: visible ? `${300 + i * 150}ms` : "0ms" }}
              >
                {/* Icon bubble */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#D98C00]/10 border border-[#D98C00]/30 flex items-center justify-center text-2xl shadow-sm">
                  {pt.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-0.5">{pt.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExchangeSection;
