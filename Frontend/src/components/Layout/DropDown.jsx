import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles.js";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const submitHandle = (cat) => {
    navigate(`/products?category=${cat.name || cat.title}`);
    setDropDown(false);
    window.location.reload();
  };

  return (
    <div className="pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm">
      {categoriesData &&
        categoriesData.map((cat, index) => (
          <div
            key={cat._id || index}
            className={`${styles.noramlFlex}`}
            onClick={() => submitHandle(cat)}
          >
            <img
              src={cat.image || cat.image_Url || ""}
              style={{
                width: "25px",
                height: "25px",
                objectFit: "contain",
                marginLeft: "10px",
                userSelect: "none",
              }}
              alt=""
            />
            <h3 className="m-3 cursor-pointer select-none">
              {cat.name || cat.title}
            </h3>
          </div>
        ))}
    </div>
  );
};

export default DropDown;
