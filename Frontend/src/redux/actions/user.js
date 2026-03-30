import api from "../api/axios";

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "LoadUserRequest" });

    const { data } = await api.get("/v2/user/getuser");

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