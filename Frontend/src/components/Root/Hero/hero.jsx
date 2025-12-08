import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import HeroImage from "../../../Assets/Logo/hero.png";

const hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage: `url(${HeroImage})`,
        backgroundSize: "cover", // Make the image cover the entire div
        backgroundPosition: "center", // Center the image
        backgroundRepeat: "no-repeat", // Avoid repeating the image
        width: "100%", // Full width of the page
        height: "80vh",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%] ml-[70px]`}>
        <h1
          className={`text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          Rediscover Stories,
          <br>
          </br>One Book at a Time
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
          Buy, sell, or exchange old books with ease. Connect with fellow book lovers, 
          <br></br>give your books a second life, and explore a world of stories waiting to be discovered all in one trusted marketplace.{" "}
          <br /> Save money, reduce waste, and keep your bookshelf ever-growing with treasures from the past."
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default hero;
