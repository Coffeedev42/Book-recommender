import { Routes, Route } from "react-router-dom";
import BookSearchPage from "./pages/BookSearchPage";
import BookCategoryPage from "./pages/BookCategoryPage";
import SigninPage from "./pages/SignInPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
    return (
        <div className="flex  inter  inter-regular">
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <BookSearchPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/category"
                    element={
                        <ProtectedRoute>
                            <BookCategoryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recommendations"
                    element={
                        <ProtectedRoute>
                            <RecommendationsPage />
                        </ProtectedRoute>
                    }
                />

                <Route path="/login" element={<SigninPage />} />
            </Routes>
        </div>
    );
};

export default App;
