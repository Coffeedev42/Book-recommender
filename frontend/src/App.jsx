import { Routes, Route } from "react-router-dom";
import BookSearchPage from "./pages/BookSearchPage";
import BookCategoryPage from "./pages/BookCategoryPage";
import SigninPage from "./pages/SignInPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import { Toaster } from "react-hot-toast";

const App = () => {
    return (
        <div className="flex  inter  inter-regular">
            <Toaster position="bottom-right" />
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
                <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </div>
    );
};

export default App;
