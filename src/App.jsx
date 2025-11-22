import { Routes, Route } from "react-router-dom";
import BookSearchpage from "./pages/BookSearchpage";
import BookCatergoryPage from "./pages/BookCatergoryPage";
import SigninPage from "./pages/SignInPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <div className="flex w-screen inter max-h-screen inter-regular">
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <BookSearchpage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/category"
                    element={
                        <ProtectedRoute>
                            <BookCatergoryPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/login" element={<SigninPage />} />
            </Routes>
        </div>
    );
};

export default App;
