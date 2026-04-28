import React, { useEffect, useRef, useState } from "react";

/* ── Animated Counter Hook ── */
const useCounter = (target, isVisible, duration = 1800) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return count;
};

const stats = [
  { value: 500, suffix: "+", label: "Books Listed", icon: "📚" },
  { value: 300, suffix: "+", label: "Happy Readers", icon: "😊" },
  { value: 120, suffix: "+", label: "Exchanges Done", icon: "🔄" },
  { value: 40,  suffix: "+", label: "Categories",    icon: "🏷️" },
];

const features = [
  {
    icon: "🛡️",
    title: "Safe & Trusted",
    desc: "Every seller is verified. Buy and exchange with complete peace of mind.",
    color: "bg-blue-50 border-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    icon: "⚡",
    title: "Fast Delivery",
    desc: "Quick dispatch and reliable delivery right to your doorstep.",
    color: "bg-amber-50 border-amber-100",
    iconBg: "bg-amber-100",
  },
  {
    icon: "💰",
    title: "Best Prices",
    desc: "Find pre-loved books at a fraction of their original price.",
    color: "bg-green-50 border-green-100",
    iconBg: "bg-green-100",
  },
  {
    icon: "🌿",
    title: "Eco Friendly",
    desc: "Reduce paper waste by giving books a second life instead of discarding them.",
    color: "bg-emerald-50 border-emerald-100",
    iconBg: "bg-emerald-100",
  },
  {
    icon: "🔍",
    title: "Easy Discovery",
    desc: "Browse across dozens of categories and find exactly what you're looking for.",
    color: "bg-purple-50 border-purple-100",
    iconBg: "bg-purple-100",
  },
  {
    icon: "🤝",
    title: "Community First",
    desc: "A growing community of passionate readers helping each other read more.",
    color: "bg-rose-50 border-rose-100",
    iconBg: "bg-rose-100",
  },
];

/* ── Stat Card ── */
const StatCard = ({ stat, isVisible, delay }) => {
  const count = useCounter(stat.value, isVisible);
  return (
    <div
      className={`flex flex-col items-center justify-center bg-white rounded-2xl shadow-md p-6 border border-gray-100 transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-4xl mb-2">{stat.icon}</span>
      <p className="text-4xl font-extrabold text-[#D98C00]">
        {count}
        {stat.suffix}
      </p>
      <p className="text-gray-500 text-sm font-medium mt-1">{stat.label}</p>
    </div>
  );
};

/* ── Feature Card ── */
const FeatureCard = ({ feat, isVisible, delay }) => (
  <div
    className={`flex gap-4 items-start p-5 rounded-2xl border ${feat.color} transition-all duration-700 ease-out hover:shadow-lg hover:-translate-y-1 cursor-default ${
      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div
      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${feat.iconBg}`}
    >
      {feat.icon}
    </div>
    <div>
      <h3 className="font-bold text-gray-800 text-base mb-1">{feat.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
    </div>
  </div>
);

/* ── Main Section ── */
const WhyRebook = () => {
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
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-gray-50 to-white py-20 px-6"
    >
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div
          className={`text-center mb-14 transition-all duration-1000 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block mb-3 px-4 py-1 bg-[#D98C00]/10 text-[#D98C00] text-xs font-bold uppercase tracking-widest rounded-full border border-[#D98C00]/30">
            Why Rebook?
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Trusted by Readers <br />
            <span className="text-[#D98C00]">Across Pakistan</span>
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            Join thousands of readers who buy, sell, and exchange books — sustainably and affordably.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} isVisible={visible} delay={i * 120} />
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => (
            <FeatureCard key={i} feat={feat} isVisible={visible} delay={200 + i * 100} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRebook;
