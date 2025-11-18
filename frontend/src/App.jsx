import { Routes, Route } from "react-router-dom";
import BookSearchpage from "./pages/BookSearchpage";
import BookCatergoryPage from "./pages/BookCatergoryPage";
const App = () => {
  return (
    <div className="flex w-screen  max-h-[100vh] inter-regular">
      
      <Routes>
        <Route path="/" element={<BookSearchpage />} />
        <Route path="/catergory" element={<BookCatergoryPage />} />
      </Routes>
    </div>
  );
};

export default App;
