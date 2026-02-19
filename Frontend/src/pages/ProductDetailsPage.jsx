import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Header from "../components/Layout/Header"
import Footer from "../components/Layout/Footer"
import ProductDetails from "../components/Products/ProductDetails"
import { productData } from "../static/data"
import SuggestedProduct from "../components/Products/SuggestedProduct"


const ProductDetailsPage = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)

  useEffect(() => {
    const foundProduct = productData.find(
      (item) => item.id === Number(id)
    )
    setBook(foundProduct)
  }, [id])

  return (
    <>

      <Header />
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1">
          <ProductDetails book={book} /> 
          {
          book && <SuggestedProduct book={book}/>
          }
        </div>
        <Footer />
      </div>


    </>
  )
}

export default ProductDetailsPage
