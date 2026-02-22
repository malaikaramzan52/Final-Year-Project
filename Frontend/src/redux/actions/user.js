import axios from "axios";
import { server } from "../server"; // adjust path if needed

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const { data } = await axios.get(
      `${server}/api/v2/user/getuser`,
      { withCredentials: true }
    );

    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });

  } catch (error) {
    dispatch({
      type: "LoadUserFailure",
      payload: error.response?.data?.message || "Failed to load user",
    });
  }
};