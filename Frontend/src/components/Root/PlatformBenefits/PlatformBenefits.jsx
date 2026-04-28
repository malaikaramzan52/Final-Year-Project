import React, { useEffect, useRef, useState } from "react";
import book1 from "../../../Assets/Book 1.jpg";
import book2 from "../../../Assets/Book 2.jpg";
import bookMain from "../../../Assets/Book.jpg";

const benefits = [
  {
    img: book1,
    tag: "💰 Save Money",
    title: "Buy Books at Unbeatable Prices",
    desc: "Why spend a fortune on brand-new books when you can get the same knowledge at a fraction of the cost? Rebook connects you with sellers offering pre-loved books — same content, lighter on your wallet.",
    points: [
      "Up to 70% cheaper than retail stores",
      "No middlemen — buy directly from readers",
      "Find rare & out-of-print editions",
    ],
    align: "left",
    accent: "#D98C00",
    tagBg: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    img: book2,
    tag: "🌿 Go Green",
    title: "Read Sustainably, Help the Planet",
    desc: "Every book exchanged or resold is a tree saved. By choosing Rebook, you actively reduce paper waste and carbon footprint — making your love for reading also a love for the environment.",
    points: [
      "Reduce paper waste with every exchange",
      "Give books a second life instead of discarding",
      "Be part of Pakistan's green reading movement",
    ],
    align: "right",
    accent: "#16a34a",
    tagBg: "bg-green-50 text-green-700 border-green-200",
  },
  {
    img: bookMain,
    tag: "🤝 Build Community",
    title: "Connect with Fellow Book Lovers",
    desc: "Rebook is more than a marketplace — it's a community. Meet readers who share your passion, exchange recommendations, and grow your personal library through human connections.",
    points: [
      "Become a verified seller in minutes",
      "Exchange books with readers near you",
      "Discover what your community is reading",
    ],
    align: "left",
    accent: "#7c3aed",
    tagBg: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

/* ── Single Benefit Block ── */
const BenefitBlock = ({ benefit, index }) => {
  const blockRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const isRight = benefit.align === "right";

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
    if (blockRef.current) observer.observe(blockRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={blockRef}
      className={`flex flex-col ${
        isRight ? "lg:flex-row-reverse" : "lg:flex-row"
      } items-center gap-12 mb-16 last:mb-0`}
    >
      {/* Image */}
      <div
        className={`w-full lg:w-[48%] transition-all duration-1000 ease-out ${
          visible
            ? "opacity-100 translate-x-0"
            : isRight
            ? "opacity-0 translate-x-16"
            : "opacity-0 -translate-x-16"
        }`}
      >
        <div className="relative">
          <div
            className="absolute -top-4 -left-4 w-full h-full rounded-3xl z-0"
            style={{ border: `3px solid ${benefit.accent}30` }}
          />
          <img
            src={benefit.img}
            alt={benefit.title}
            className="relative z-10 w-full max-h-[420px] object-cover rounded-3xl shadow-xl"
          />
          {/* glowing dot accent */}
          <div
            className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full z-20 opacity-30 blur-xl"
            style={{ backgroundColor: benefit.accent }}
          />
        </div>
      </div>

      {/* Text */}
      <div
        className={`w-full lg:w-[52%] transition-all duration-1000 ease-out delay-200 ${
          visible
            ? "opacity-100 translate-x-0"
            : isRight
            ? "opacity-0 -translate-x-16"
            : "opacity-0 translate-x-16"
        }`}
      >
        <span
          className={`inline-block mb-4 px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full border ${benefit.tagBg}`}
        >
          {benefit.tag}
        </span>

        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          {benefit.title}
        </h2>

        <p className="text-gray-500 text-base leading-relaxed mb-7">
          {benefit.desc}
        </p>

        {/* Bullet points */}
        <ul className="space-y-3">
          {benefit.points.map((pt, i) => (
            <li
              key={i}
              className={`flex items-start gap-3 transition-all duration-700 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: visible ? `${400 + i * 150}ms` : "0ms" }}
            >
              <span
                className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                style={{ backgroundColor: benefit.accent }}
              >
                ✓
              </span>
              <span className="text-gray-700 font-medium text-sm">{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/* ── Main Section ── */
const PlatformBenefits = () => {
  const headRef = useRef(null);
  const [headVisible, setHeadVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (headRef.current) observer.observe(headRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Section Heading */}
        <div
          ref={headRef}
          className={`text-center mb-20 transition-all duration-1000 ease-out ${
            headVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block mb-3 px-4 py-1 bg-[#D98C00]/10 text-[#D98C00] text-xs font-bold uppercase tracking-widest rounded-full border border-[#D98C00]/30">
            Platform Benefits
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mt-2">
            Why Rebook is{" "}
            <span className="text-[#D98C00]">Good for You</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
            Rebook isn't just a platform — it's a smarter way to read. Discover
            what makes us different and why thousands of readers choose us.
          </p>
        </div>

        {/* Benefits */}
        {benefits.map((benefit, i) => (
          <BenefitBlock key={i} benefit={benefit} index={i} />
        ))}
      </div>
    </section>
  );
};

export default PlatformBenefits;
