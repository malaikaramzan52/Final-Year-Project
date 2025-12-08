import React from 'react'
import Header from "../components/Layout/Header"
import Hero from "../components/Root/Hero/hero"

const HomePage = () => {
  return (
    <div>
    <Header activeHeading={1}/>
    <Hero/>
    </div>
  )
}

export default HomePage
