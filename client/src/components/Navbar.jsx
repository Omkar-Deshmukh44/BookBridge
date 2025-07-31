import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Menu, User, LogOut, Settings, BookOpen, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";

import logo from "../assets/logo.svg";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on component mount and location change
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location.pathname]);

  // Utility function to check active route
  const isActive = (path) => location.pathname === path;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.name) return "KH";
    return user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <header className="w-full shadow-lg bg-white dark:bg-gray-900 sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 lg:px-6 py-3">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 px-2 group">
          <div className="relative">
            <img 
              src={logo} 
              alt="KitabHunt Logo" 
              className="h-[50px] transition-transform duration-200 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#247BA0] to-[#70C1B3] opacity-0 group-hover:opacity-20 rounded-full transition-opacity duration-200"></div>
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white hidden sm:block">
            
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link to="/">
            <Button
              variant="ghost"
              className={`text-base font-semibold transition-all duration-200 hover:text-[#9333ea] hover:bg-[#9333ea]/10 px-4 py-2 rounded-lg ${
                isActive("/") ? "bg-[#9333ea]/15 text-[#9333ea] border-b-2 border-[#9333ea]" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link to="/buy">
            <Button
              variant="ghost"
              className={`text-base font-semibold transition-all duration-200 hover:text-[#9333ea] hover:bg-[#9333ea]/10 px-4 py-2 rounded-lg ${
                isActive("/buy") ? "bg-[#9333ea]/15 text-[#9333ea] border-b-2 border-[#9333ea]" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Buy Books
            </Button>
          </Link>
          <Link to="/sell">
            <Button
              variant="ghost"
              className={`text-base font-semibold transition-all duration-200 hover:text-[#9333ea] hover:bg-[#9333ea]/10 px-4 py-2 rounded-lg ${
                isActive("/sell") ? "bg-[#9333ea]/15 text-[#9333ea] border-b-2 border-[#9333ea]" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Sell Books
            </Button>
          </Link>
        </nav>

        {/* Profile / Sign In */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="flex items-center space-x-3">
              {/* Notifications Badge */}
              
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Avatar className="w-9 h-9 ring-2 ring-[#247BA0]/20 hover:ring-[#247BA0]/40 transition-all">
                      <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
                      <AvatarFallback className="bg-gradient-to-br from-[#247BA0] to-[#70C1B3] text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-500">{user?.email || "user@example.com"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="flex items-center cursor-pointer">
                      <Heart className="w-4 h-4 mr-2" />
                      My Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login">
                <Button 
                  variant="outline"
                  className="border-gray-700 text-[#9333ea] hover:opacity-50 hover:text-[#9333ea] transition-all duration-200"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-[#9333ea] to-[#70C1B3] hover:opacity-70 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-6 w-6" />
                {isLoggedIn && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#247BA0] rounded-full border-2 border-white"></div>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white dark:bg-gray-900 w-80">
              <div className="flex flex-col space-y-6 mt-8">
                
                {/* Mobile Profile Section */}
                {isLoggedIn && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
                      <AvatarFallback className="bg-gradient-to-br from-[#247BA0] to-[#70C1B3] text-white font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mobile Navigation */}
                <div className="space-y-2">
                  <Link to="/">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        isActive("/") ? "bg-[#247BA0]/15 text-[#247BA0] border-r-4 border-[#247BA0]" : ""
                      }`}
                    >
                      <BookOpen className="w-4 h-4 mr-3" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/buy">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        isActive("/buy") ? "bg-[#247BA0]/15 text-[#247BA0] border-r-4 border-[#247BA0]" : ""
                      }`}
                    >
                      Buy Books
                    </Button>
                  </Link>
                  <Link to="/sell">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        isActive("/sell") ? "bg-[#247BA0]/15 text-[#247BA0] border-r-4 border-[#247BA0]" : ""
                      }`}
                    >
                      Sell Books
                    </Button>
                  </Link>
                </div>

                {/* Mobile Auth Section */}
                {isLoggedIn ? (
                  <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link to="/dashboard">
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button variant="ghost" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-3" />
                        Profile Settings
                      </Button>
                    </Link>
                    <Link to="/favorites">
                      <Button variant="ghost" className="w-full justify-start">
                        <Heart className="w-4 h-4 mr-3" />
                        My Favorites
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-4 border-t border-black dark:border-gray-700">
                    <Link to="/login">
                      <Button variant="outline" className="w-full text-black">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full bg-gradient-to-r from-[#9333ea] to-[#70C1B3] hover:from-[#1e6a8a] hover:to-[#5ea89c]">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}