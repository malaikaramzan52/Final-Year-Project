import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BecomeSeller = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/profile", { state: { activeTab: 2 }, replace: true });
  }, [navigate]);

  return null;
};

export default BecomeSeller;
