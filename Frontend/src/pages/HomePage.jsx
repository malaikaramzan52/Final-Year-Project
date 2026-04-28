import React from 'react'
import Header from "../components/Layout/Header"
import Hero from "../components/Root/Hero/hero"
import Categories from "../components/Root/Categories/categories";
import BestDeals from "../components/Root/BestDeals/BestDeals";
import ExchangeSection from "../components/Root/ExchangeSection/ExchangeSection";
import ExchangeableBooks from "../components/Root/ExchangeSection/ExchangeableBooks";
import PlatformBenefits from "../components/Root/PlatformBenefits/PlatformBenefits";
import Footer from "../components/Layout/Footer";

const HomePage = () => {
  return (
    <div>
    <Header activeHeading={1}/>
    <Hero/>
    <Categories/>
    <BestDeals/>
    <ExchangeSection/>
    <ExchangeableBooks/>
    <PlatformBenefits/>
    <Footer />
    </div>
  )
}

export default HomePage
