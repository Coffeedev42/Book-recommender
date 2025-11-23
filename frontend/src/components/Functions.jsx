import { useContext } from "react";
import { Context } from "../context/ContextProvider";

const { addedBooks, setAddedBooks } = useContext(Context);

export const GetRecommendations = async () => {
  //   try {
  //     const URL = "http://localhost:5000/login";
  //     const response = await axios.post(URL, loginValues, {
  //       withCredentials: true,
  //     });
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Login failed:", error);
  // }
  console.log(addedBooks);
};
