import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layouts/Layout";
import Home from "./Pages/User/Home";
import About from "./Pages/User/About";
import Menu from "./Pages/User/Menu";
import Reservation from "./Pages/User/Reservation";
import Contact from "./Pages/User/Contact";
import Products from "./Pages/User/Products";
import Blogs from "./Pages/User/Blogs";
import Blog from "./Pages/User/Blog";
import Jobs from "./Pages/User/Jobs";
import Partnership from "./Pages/User/Partnership";
import UserLayout from "./Layouts/UserLayout";
import EditProfile from "./Pages/UserProfile/EditProfile";
import Liked from "./Pages/UserProfile/Liked";
import OrderHistories from "./Pages/UserProfile/OrderHistories";
import OrderDetails from "./Pages/UserProfile/OrderDetails";
import ReservationHistories from "./Pages/UserProfile/ReservationHistories";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import AdminLayout from "./Layouts/AdminLayout";
import Dashboard from "./Pages/Admin/Dashboard";
import MenuList from "./Pages/Admin/MenuList";
import MenuGrid from "./Pages/Admin/MenuGrid";
import Category from "./Pages/Admin/Category";
import ProductsList from "./Pages/Admin/ProductsList";
import ProductsGrid from "./Pages/Admin/ProductsGrid";
import ProductForm from "./Pages/Admin/ProductForm";
import AdminOrderHistories from "./Pages/Admin/AdminOrderHistories";
import AdminOrderDetails from "./Pages/Admin/AdminOrderDetails";
import ReservationList from "./Pages/Admin/ReservationsList";
import ReservationCalendar from "./Pages/Admin/ReservationCalendar";
import UsersList from "./Pages/Admin/UsersList";
import BlogsList from "./Pages/Admin/BlogsList";
import BlogForm from "./Pages/Admin/BlogForm";
import ReviewsList from "./Pages/Admin/ReviewsList";
import ContactsList from "./Pages/Admin/ContactsList";
import ContactMessage from "./Pages/Admin/ContactMessage";
import JobApplications from "./Pages/Admin/JobApplications";
import JobPostForm from "./Pages/Admin/JobPostForm";
import PartnershipApplications from "./Pages/Admin/PartnershipApplications";
import Setting from "./Pages/Admin/Setting";
import AdminProfile from "./Pages/Admin/AdminProfile";
import Checkout from "./Pages/User/Checkout";
import MenuForm from "./Pages/Admin/MenuForm";
import JobPosts from "./Pages/Admin/JobPosts";
import Reviews from "./Pages/User/Reviews";
import PartnershipApproved from "./Pages/Admin/PartnershipApproved";
import PartnershipRejected from "./Pages/Admin/PartnershipRejected";
import ProtectedRoute from "./Components/ProtectedRoute";
import UserSidebar from "./Pages/User/UserSidebar";
import Banned from "./Components/Home/Banned";
import BannedRedirect from "./Components/BannedRedirect";
import { SearchProvider } from "./contexts/SearchContext";
import AdminRoute from "./Components/AdminRoute";
import Cart from "./Pages/User/Cart";

const routes = createBrowserRouter([
    {
        path: "/",
        element: (
            <SearchProvider>
                <Layout />
            </SearchProvider>
        ),
        children: [
            {
                path: "/",
                element: (
                    <BannedRedirect>
                        <Home />
                    </BannedRedirect>
                ),
            },
            {
                path: "/products",
                element: <Products />,
            },
            {
                path: "/menu",
                element: <Menu />,
            },
            {
                path: "/reservation",
                element: <Reservation />,
            },
            {
                path: "/contact",
                element: <Contact />,
            },
            {
                path: "/checkout",
                element: <Checkout />,
            },
            {
                path: "/review",
                element: <Reviews />,
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/blogs",
                element: <Blogs />,
            },
            {
                path: "/blog/:id",
                element: <Blog />,
            },
            {
                path: "/jobs",
                element: <Jobs />,
            },
            {
                path: "/partnerships",
                element: <Partnership />,
            },
            {
                path: "/cart",
                element: <Cart />,
            },
        ],
    },
    {
        path: "/banned",
        element: <Banned />,
    },
    {
        path: "/user",
        element: (
            <ProtectedRoute>
                <SearchProvider>
                    <UserLayout />
                </SearchProvider>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/user",
                element: <EditProfile />,
            },
            {
                path: "/user/liked",
                element: <Liked />,
            },
            {
                path: "/user/orders",
                element: <OrderHistories />,
            },
            {
                path: "/user/order/:id",
                element: <OrderDetails />,
            },
            {
                path: "/user/reservations",
                element: <ReservationHistories />,
            },
        ],
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminRoute>
                    <SearchProvider>
                        <AdminLayout />
                    </SearchProvider>
                </AdminRoute>
            </ProtectedRoute>
        ),
        children: [
            {
                path: "/admin",
                element: <Dashboard />,
            },
            {
                path: "/admin/menu",
                element: <MenuList />,
            },
            {
                path: "/admin/menu/grid",
                element: <MenuGrid />,
            },
            {
                path: "/admin/menu/create",
                element: <MenuForm />,
            },
            {
                path: "/admin/menu/:id/edit",
                element: <MenuForm />,
            },
            {
                path: "/admin/category",
                element: <Category />,
            },
            {
                path: "/admin/products",
                element: <ProductsList />,
            },
            {
                path: "/admin/products/grid",
                element: <ProductsGrid />,
            },
            {
                path: "/admin/products/create",
                element: <ProductForm />,
            },
            {
                path: "/admin/product/:id/edit",
                element: <ProductForm />,
            },
            {
                path: "/admin/orders",
                element: <AdminOrderHistories />,
            },
            {
                path: "/admin/order/:id",
                element: <AdminOrderDetails />,
            },
            {
                path: "/admin/reservation",
                element: <ReservationList />,
            },
            {
                path: "/admin/reservation/calendar",
                element: <ReservationCalendar />,
            },
            {
                path: "/admin/users",
                element: <UsersList />,
            },
            {
                path: "/admin/blogs",
                element: <BlogsList />,
            },
            {
                path: "/admin/blogs/create",
                element: <BlogForm />,
            },
            {
                path: "/admin/blogs/:id/edit",
                element: <BlogForm />,
            },
            {
                path: "/admin/reviews",
                element: <ReviewsList />,
            },
            {
                path: "/admin/contact",
                element: <ContactsList />,
            },
            {
                path: "/admin/contact/:id",
                element: <ContactMessage />,
            },
            {
                path: "/admin/jobs",
                element: <JobPosts />,
            },
            {
                path: "/admin/jobs/applications",
                element: <JobApplications />,
            },
            {
                path: "/admin/jobs/create",
                element: <JobPostForm />,
            },
            {
                path: "/admin/jobs/:id/edit",
                element: <JobPostForm />,
            },
            {
                path: "/admin/partnership",
                element: <PartnershipApplications />,
            },
            {
                path: "/admin/partnerships/approved",
                element: <PartnershipApproved />,
            },
            {
                path: "/admin/partnerships/rejected",
                element: <PartnershipRejected />,
            },
            {
                path: "/admin/settings",
                element: <Setting />,
            },
            {
                path: "/admin/profile",
                element: <AdminProfile />,
            },
        ],
    },
]);

export default routes;
