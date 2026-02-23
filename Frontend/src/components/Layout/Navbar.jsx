import React from "react";
import { Link } from "react-router-dom";
import { navItems } from "../../static/data";
import styles from "../../styles/styles";

const Navbar = ({ active }) => {
  return (
    <div className={`block 800px:${styles.noramlFlex} 800px:gap-3`}>
      {navItems.map((i, index) => (
        <div className="flex" key={i.id || index}>
          <Link
            to={i.url}
            className={`
              pb-[30px] 800px:pb-0 px-4 cursor-pointer font-[500]
              rounded-full transition-all duration-300 ease-in-out
              ${
                active === index + 1
                  ? "bg-white text-black shadow-md"
                  : "text-black 800px:text-white hover:bg-white hover:text-black"
              }
            `}
          >
            {i.title}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Navbar;