import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RootLayout from './components/RootLayout';
import ProtectedLayout from './components/ProtectedLayout';
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage";

import AdminBooksPage from "./pages/AdminBooksPage";
import AdminBookDetailsPage from "./pages/AdminBookDetailsPage";
import UserBooksPage from "./pages/UserBooksPage";
import UserBookDetailsPage from "./pages/UserBookDetailsPage";
import CreateBookPage from "./pages/CreateBookPage";
import CreateCategoryPage from "./pages/CreateCategoryPage";

import CategoriesPage from './pages/CategoriesPage';
import CategoryDetailsPage from './pages/CategoryDetailsPage';

import ManageBorrowRequestsPage from './pages/ManageBorrowRequestsPage';
import MyBorrowRequestsPage from './pages/MyBorrowRequestsPage';
import BorrowRequestDetailsPage from "./pages/BorrowRequestDetailsPage";
import RegisterPage from "./pages/RegisterPage";
import RegisterAdminPage from "./pages/RegisterAdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public login route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Redirect root "/" to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes */}
        <Route path="/" element={<RootLayout />}>
          {/* Routes accessible by both Admin and User */}
          <Route element={<ProtectedLayout allowedRoles={['Admin', 'User']} />}>
            <Route path="home" element={<HomePage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedLayout allowedRoles={['Admin']} />}>
            <Route path="manage-books" element={<AdminBooksPage />} />
            <Route path="manage-books/:id" element={<AdminBookDetailsPage />} />
            <Route path="manage-categories" element={<CategoriesPage />} />
            <Route path="manage-categories/:id" element={<CategoryDetailsPage />} />
            <Route path="manage-books/create" element={<CreateBookPage />} />
            <Route path="manage-categories/create" element={<CreateCategoryPage />} />
            <Route path="manage-borrow-requests" element={<ManageBorrowRequestsPage />} />
            <Route path="manage-borrow-requests/:id" element={<BorrowRequestDetailsPage />} />
            <Route path="register-admin" element={<RegisterAdminPage />} />
          </Route>

          {/* User-only routes */}
          <Route element={<ProtectedLayout allowedRoles={['User']} />}>
            <Route path="books" element={<UserBooksPage />} />
            <Route path="books/:id" element={<UserBookDetailsPage />} />
            <Route path="my-borrow-requests" element={<MyBorrowRequestsPage />} />
            <Route path="my-borrow-requests/:id" element={<BorrowRequestDetailsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;