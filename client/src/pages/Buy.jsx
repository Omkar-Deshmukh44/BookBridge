import { Input } from "../components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, Filter, Book, User, MapPin, RefreshCw, X, SlidersHorizontal, Star, Calendar, DollarSign, Package, Sparkles, Heart, Eye, TrendingUp } from "lucide-react"

export default function BuyPage() {
  const [books, setBooks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [department, setDepartment] = useState("")
  const [classYear, setClassYear] = useState("")
  const [subject, setSubject] = useState("")
  const [condition, setCondition] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [favoriteBooks, setFavoriteBooks] = useState(new Set())

  const sortOptions = [
    { value: "newest", label: "✨ Latest First", icon: "🆕" },
    { value: "oldest", label: "📅 Oldest First", icon: "⏰" },
    { value: "price-low", label: "💰 Price: Low to High", icon: "📈" },
    { value: "price-high", label: "💎 Price: High to Low", icon: "📉" },
    { value: "title", label: "📖 Title A-Z", icon: "🔤" },
    { value: "author", label: "👨‍💼 Author A-Z", icon: "✍️" }
  ]

  // Fetch statistics for dynamic filter options
  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchBooks()
    }, 300) // Debounce search to avoid too many API calls

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, department, classYear, subject, condition, minPrice, maxPrice, sortBy])

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books/stats')
      const data = await response.json()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    setError(null)

    const queryParams = new URLSearchParams()
    if (searchTerm.trim()) queryParams.append('search', searchTerm.trim())
    if (department) queryParams.append('department', department)
    if (classYear) queryParams.append('year', classYear)
    if (subject) queryParams.append('subject', subject)
    if (condition) queryParams.append('condition', condition)
    if (minPrice) queryParams.append('minPrice', minPrice)
    if (maxPrice) queryParams.append('maxPrice', maxPrice)
    if (sortBy) queryParams.append('sortBy', sortBy)

    const url = `http://localhost:5000/api/books${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

    try {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        const booksData = data.books || []
        const availableBooks = booksData.filter(book => !book.status || book.status === 'available')
        setBooks(availableBooks)
      } else {
        throw new Error(data.error || 'Failed to fetch books')
      }
    } catch (err) {
      console.error('❌ Error fetching books:', err)
      setError(`Unable to fetch books: ${err.message}`)
      // Fallback to sample data
      setBooks(sampleBooks)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, department, classYear, subject, condition, minPrice, maxPrice, sortBy])

  const sampleBooks = [
    {
      _id: "1",
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      department: "CS",
      year: "SE",
      subject: "DSA",
      price: 350,
      condition: "Good",
      location: "Hostel A, Room 204",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      sellerName: "Rohan J.",
      sellerPhone: "+919876543210",
      createdAt: new Date().toISOString(),
      description: "Well-maintained algorithm book with minimal highlighting"
    },
    {
      _id: "2",
      title: "Database System Concepts",
      author: "Abraham Silberschatz",
      department: "IT",
      year: "TE",
      subject: "DBMS",
      price: 450,
      condition: "Like New",
      location: "Hostel B, Room 105",
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
      sellerName: "Priya S.",
      sellerPhone: "+919876543211",
      createdAt: new Date().toISOString(),
      description: "Excellent condition database book"
    },
    {
      _id: "3",
      title: "Operating System Concepts",
      author: "Abraham Silberschatz",
      department: "CS",
      year: "TE",
      subject: "OS",
      price: 300,
      condition: "Fair",
      location: "Day Scholar",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      sellerName: "Amit K.",
      sellerPhone: "+919876543212",
      createdAt: new Date().toISOString(),
      description: "Some wear but all content intact"
    }
  ]

  const clearFilters = () => {
    setSearchTerm("")
    setDepartment("")
    setClassYear("")
    setSubject("")
    setCondition("")
    setMinPrice("")
    setMaxPrice("")
    setSortBy("newest")
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Like New": return "text-emerald-700 bg-emerald-100 border-emerald-200"
      case "Good": return "text-blue-700 bg-blue-100 border-blue-200"
      case "Fair": return "text-amber-700 bg-amber-100 border-amber-200"
      case "Acceptable": return "text-red-700 bg-red-100 border-red-200"
      default: return "text-gray-700 bg-gray-100 border-gray-200"
    }
  }

  const getConditionIcon = (condition) => {
    switch (condition) {
      case "Like New": return "✨"
      case "Good": return "👍"
      case "Fair": return "👌"
      case "Acceptable": return "⚠️"
      default: return "📦"
    }
  }

  const handleContactSeller = (book) => {
    const message = `Hi ${book.sellerName}! 👋 I'm interested in your book "${book.title}" listed for ₹${book.price}. Is it still available? 📚`
    const whatsappUrl = `https://wa.me/${book.sellerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const toggleFavorite = (bookId) => {
    const newFavorites = new Set(favoriteBooks)
    if (newFavorites.has(bookId)) {
      newFavorites.delete(bookId)
    } else {
      newFavorites.add(bookId)
    }
    setFavoriteBooks(newFavorites)
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays <= 7) return `${diffDays} days ago`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (searchTerm.trim()) count++
    if (department) count++
    if (classYear) count++
    if (subject) count++
    if (condition) count++
    if (minPrice) count++
    if (maxPrice) count++
    return count
  }, [searchTerm, department, classYear, subject, condition, minPrice, maxPrice])

  if (loading && books.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <RefreshCw className="h-16 w-16 animate-spin mx-auto text-blue-500" />
            <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <p className="text-xl text-gray-700 font-medium">Finding amazing books for you...</p>
          <p className="text-sm text-gray-500">This won't take long!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="p-4 max-w-7xl mx-auto">
        {/* Modern Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 blur-3xl"></div>
          <div className="relative">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Buy Books
            </h1>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              Discover your next favorite textbook from fellow students. Quality books, great prices! ✨
            </p>
            {stats && (
              <div className="flex justify-center items-center gap-6 mt-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Book className="h-4 w-4" />
                  {stats.totalBooks} books available
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Starting from ₹{Math.round(stats.minPrice || 0)}
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Enhanced Search and Filter Card */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Main Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="🔍 Search by book title, author, subject, or seller..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Filter Toggle and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 h-11 px-6 border-2 hover:border-blue-500 transition-all duration-200"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Advanced Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-blue-500 text-white">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48 border-2 border-gray-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Expandable Advanced Filters */}
              {showFilters && (
                <div className="pt-6 border-t border-gray-200 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Department Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        🏢 Department
                      </label>
                      <Select value={department} onValueChange={setDepartment}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Departments</SelectItem>
                          {(stats?.departments || ['CS', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']).map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Year Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        🎓 Academic Year
                      </label>
                      <Select value={classYear} onValueChange={setClassYear}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="All Years" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Years</SelectItem>
                          {(stats?.years || ['FE', 'SE', 'TE', 'BE']).map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Subject Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        📖 Subject
                      </label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="All Subjects" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Subjects</SelectItem>
                          {(stats?.subjects || ['DSA', 'DBMS', 'OS', 'CN', 'AI', 'ML']).map(subj => (
                            <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Condition Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        ⭐ Condition
                      </label>
                      <Select value={condition} onValueChange={setCondition}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="All Conditions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Conditions</SelectItem>
                          {(stats?.conditions || ['Like New', 'Good', 'Fair', 'Acceptable']).map(cond => (
                            <SelectItem key={cond} value={cond}>
                              <span className="flex items-center gap-2">
                                {getConditionIcon(cond)} {cond}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      💰 Price Range
                    </label>
                    <div className="flex gap-4 items-center">
                      <Input
                        type="number"
                        placeholder="Min ₹"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="flex-1 border-2 border-gray-200 focus:border-blue-500"
                      />
                      <span className="text-gray-500">to</span>
                      <Input
                        type="number"
                        placeholder="Max ₹"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="flex-1 border-2 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                      <span className="text-sm font-semibold text-gray-700">🏷️ Active filters:</span>
                      {searchTerm.trim() && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                          🔍 "{searchTerm}"
                          <X className="h-3 w-3 cursor-pointer hover:text-blue-600" onClick={() => setSearchTerm("")} />
                        </Badge>
                      )}
                      {department && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-purple-100 text-purple-800">
                          🏢 {department}
                          <X className="h-3 w-3 cursor-pointer hover:text-purple-600" onClick={() => setDepartment("")} />
                        </Badge>
                      )}
                      {classYear && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800">
                          🎓 {classYear}
                          <X className="h-3 w-3 cursor-pointer hover:text-green-600" onClick={() => setClassYear("")} />
                        </Badge>
                      )}
                      {subject && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                          📖 {subject}
                          <X className="h-3 w-3 cursor-pointer hover:text-orange-600" onClick={() => setSubject("")} />
                        </Badge>
                      )}
                      {condition && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
                          ⭐ {condition}
                          <X className="h-3 w-3 cursor-pointer hover:text-yellow-600" onClick={() => setCondition("")} />
                        </Badge>
                      )}
                      {(minPrice || maxPrice) && (
                        <Badge variant="secondary" className="flex items-center gap-1 bg-pink-100 text-pink-800">
                          💰 ₹{minPrice || '0'} - ₹{maxPrice || '∞'}
                          <X className="h-3 w-3 cursor-pointer hover:text-pink-600" onClick={() => {setMinPrice(""); setMaxPrice("")}} />
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        🗑️ Clear all
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="text-lg font-medium text-gray-700">
              {books.length === 0 ? '📭 No books found' : 
               `📚 ${books.length} amazing book${books.length !== 1 ? 's' : ''} available`}
            </p>
            {loading && <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />}
          </div>
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <Card className="p-16 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="space-y-6">
              <div className="relative">
                <Book className="h-24 w-24 text-gray-300 mx-auto" />
                <Sparkles className="h-8 w-8 text-blue-400 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">No books found! 📭</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find the perfect book for your studies.
                </p>
              </div>
              <Button variant="outline" onClick={clearFilters} className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
                🔄 Clear all filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {books.map(book => (
              <Card key={book._id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg">
                <div className="relative">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img 
                      src={book.imageUrl} 
                      alt={book.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white transition-all duration-200"
                    onClick={() => toggleFavorite(book._id)}
                  >
                    <Heart className={`h-4 w-4 ${favoriteBooks.has(book._id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </Button>

                  {/* Time Badge */}
                  <Badge className="absolute top-3 left-3 bg-blue-500/90 text-white border-0">
                    {formatTimeAgo(book.createdAt)}
                  </Badge>
                </div>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 italic">✍️ by {book.author}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      🏢 {book.department} - {book.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      📖 {book.subject}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getConditionColor(book.condition)} border`}>
                      {getConditionIcon(book.condition)} {book.condition}
                    </Badge>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">₹{book.price}</span>
                      <p className="text-xs text-gray-500">Best Price!</p>
                    </div>
                  </div>

                  {book.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 bg-gray-50 p-3 rounded-lg">
                      💭 {book.description}
                    </p>
                  )}

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span className="truncate">📍 {book.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      <span>👤 {book.sellerName}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 h-12 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200"
                    onClick={() => handleContactSeller(book)}
                  >
                    💬 Contact Seller
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}