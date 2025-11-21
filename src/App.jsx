import { Routes, Route } from "react-router-dom";
import BookSearchpage from "./pages/BookSearchpage";
import BookCatergoryPage from "./pages/BookCatergoryPage";
import SigninPage from "./pages/SignInPage";
const App = () => {
  return (
    <div className="flex w-screen inter max-h-screen inter-regular">
      
      <Routes>
        <Route path="/" element={<BookSearchpage />} />
        <Route path="/catergory" element={<BookCatergoryPage />} />
        <Route path="/signin" element={<SigninPage />} />
      </Routes>
    </div>
  );
};

export default App;
