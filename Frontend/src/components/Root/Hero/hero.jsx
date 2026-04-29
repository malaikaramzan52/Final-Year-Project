import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import HeroImage from "../../../Assets/Logo/hero.png";

const hero = () => {
  return (
    <div
      className={`relative min-h-[60vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex}`}
      style={{
        backgroundImage: `url(${HeroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%] flex flex-col items-center 800px:items-start text-center 800px:text-left mx-auto 800px:ml-[70px]`}>
        <h1
          className={`text-[28px] leading-[1.1] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize`}
        >
          Rediscover Stories,
          <br className="hidden 800px:block" />
          One Book at a Time
        </h1>
        <p className="pt-5 text-[15px] 800px:text-[18px] font-[Poppins] font-[400] text-[#000000ba] max-w-[500px]">
          Buy, sell, or exchange old books with ease. Connect with fellow book lovers, 
          give your books a second life, and explore a world of stories waiting to be discovered all in one trusted marketplace.
        </p>
        <Link to="/browse" className="inline-block">
          <div className={`${styles.button} bg-[#D98C00] mt-5 !w-[180px]`}>
            <span className="text-[#fff] font-[Poppins] text-[18px]">
              Browse Books
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default hero;
