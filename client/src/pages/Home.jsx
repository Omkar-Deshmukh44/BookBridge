import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { useNavigate } from "react-router-dom"
import { Search, BookOpen, Upload, Sparkles, Users, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import "../styles/Home.css"

export default function Home() {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#000_1px,transparent_1px),linear-gradient(-45deg,#000_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full blur-3xl opacity-40"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className={`max-w-6xl w-full text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Hero Section */}
          <div className="space-y-8 mb-16">
            {/* Main Title */}
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-none mb-4">
                Book<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">Bridge</span>
              </h1>
              <div className="flex items-center justify-center gap-3 text-xl md:text-2xl text-gray-600 font-medium">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                <span>Where Knowledge Meets Community</span>
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              The premier platform for college students to discover, exchange, and monetize textbooks with ease and confidence.
            </p>
          </div>

          {/* Professional Search Bar */}
          <div className="mb-16">
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-white border-2 border-gray-100 hover:border-gray-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center p-2">
                  <Search className="ml-4 h-6 w-6 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for textbooks, authors, or ISBN..."
                    className="flex-1 bg-transparent border-0 text-gray-800 text-lg px-4 py-4 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                  />
                  <Button className="mr-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button
              onClick={() => navigate("/buy")}
              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-2xl py-6 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <BookOpen className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              Browse Books
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
            
            <Button
              onClick={() => navigate("/sell")}
              className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 rounded-2xl py-6 px-10 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            >
              <Upload className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              Sell Books
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Button>
          </div>

          {/* Professional Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { 
                icon: Search, 
                title: "Smart Discovery", 
                desc: "Advanced search algorithms help you find exactly what you need, when you need it", 
                gradient: "from-blue-500 to-cyan-500",
                bg: "from-blue-50 to-cyan-50"
              },
              { 
                icon: Users, 
                title: "Trusted Community", 
                desc: "Connect with verified students in a safe, moderated marketplace environment", 
                gradient: "from-purple-500 to-pink-500",
                bg: "from-purple-50 to-pink-50"
              },
              { 
                icon: TrendingUp, 
                title: "Best Prices", 
                desc: "Get maximum value for your books with our dynamic pricing and demand analytics", 
                gradient: "from-green-500 to-emerald-500",
                bg: "from-green-50 to-emerald-50"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`group relative bg-gradient-to-br ${feature.bg} border border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2`}
              >
                <div className="absolute inset-0 bg-white/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 mb-16 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">10,000+</div>
                <div className="text-gray-600 font-medium">Books Available</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">5,000+</div>
                <div className="text-gray-600 font-medium">Happy Students</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">$500K+</div>
                <div className="text-gray-600 font-medium">Money Saved</div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-6">Ready to transform your textbook experience?</p>
            <div className="flex items-center justify-center gap-3 text-2xl font-semibold">
              <span className="text-gray-800">Join</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BookBridge
              </span>
              <span className="text-gray-800">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}