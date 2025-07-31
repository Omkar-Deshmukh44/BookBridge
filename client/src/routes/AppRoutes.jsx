// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import BookDetail from "../pages/BookDetail"
import Chat from "../pages/Chat"
import Signup from "../pages/Signup"
import BuyPage from "../pages/Buy"
import SellPage from "../pages/Sell"

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/book/:id" element={<BookDetail />} />
      <Route path="/chat/:userId" element={<Chat />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/buy" element={<BuyPage />} />
      <Route path="/sell" element={<SellPage/>} />
    </Routes>
  )
}
