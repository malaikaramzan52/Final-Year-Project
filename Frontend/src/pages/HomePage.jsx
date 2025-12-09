import React from 'react'
import Header from "../components/Layout/Header"
import Hero from "../components/Root/Hero/hero"
import Categories from "../components/Root/Categories/categories";
// import BestDeals from "../components/Root/BestDeals/bestdeals.jsx";

const HomePage = () => {
  return (
    <div>
    <Header activeHeading={1}/>
    <Hero/>
    <Categories/>
    {/* <BestDeals/> */}
    </div>
  )
}

export default HomePage
