import { useState } from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import {
  ImagePlus, Upload, BookOpen, User, DollarSign,
  MapPin, Phone, Mail, Check, AlertCircle, Camera
} from "lucide-react"

export default function SellPage() {
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    author: "",
    department: "",
    year: "",
    subject: "",
    price: "",
    condition: "",
    description: "",
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
    location: ""
  })

  const [previewUrl, setPreviewUrl] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "image" && files.length > 0) {
      setFormData({ ...formData, image: files[0] })
      setPreviewUrl(URL.createObjectURL(files[0]))
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        setFormData({ ...formData, image: file })
        setPreviewUrl(URL.createObjectURL(file))
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const submitData = new FormData()

      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key])
        }
      })

      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        body: submitData,
        credentials: 'include'
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Book listed successfully!' })
        setFormData({
          image: null,
          title: "",
          author: "",
          department: "",
          year: "",
          subject: "",
          price: "",
          condition: "",
          description: "",
          sellerName: "",
          sellerEmail: "",
          sellerPhone: "",
          location: ""
        })
        setPreviewUrl(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Failed to list book' })
      }

    } catch (error) {
      console.error("Error listing book:", error)
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const departments = [
    "Computer Engineering", "Electronics Engineering", "Mechanical Engineering",
    "Civil Engineering", "Electrical Engineering", "Information Technology",
    "Chemical Engineering", "Biotechnology", "Other"
  ]

  const academicYears = [
    "First Year", "Second Year", "Third Year", "Fourth Year", "Masters", "PhD"
  ]

  const bookConditions = ["Like New", "Good", "Fair", "Acceptable"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#9333ea] rounded-3xl mb-2 shadow-sm">
            <BookOpen className="w-10 h-10 text-white " />
          </div>
          <h1 className="text-2xl font-bold text-black mb-2 tracking-tight">List Your Book</h1>
          <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Turn your academic books into opportunity. Connect with students who need them while earning money from books you've outgrown.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-2">
        <div className="space-y-12">
          {/* Status Message */}
          {submitStatus && (
            <div className={`p-6 rounded-2xl border-l-4 ${
              submitStatus.type === 'success'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                : 'bg-red-50 border-red-400 text-red-800'
            }`}>
              <div className="flex items-center">
                {submitStatus.type === 'success' ? (
                  <Check className="w-5 h-5 mr-3 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-3 text-red-600" />
                )}
                <span className="font-medium">{submitStatus.message}</span>
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Image</h2>
              <p className="text-gray-500">Add a clear image of your book's cover</p>
            </div>
            
            <label htmlFor="image" className="block cursor-pointer">
              <div 
                className={`relative w-full h-80 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                  dragActive 
                    ? 'border-gray-900 bg-gray-50' 
                    : previewUrl 
                      ? 'border-gray-200' 
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img src={previewUrl} alt="Book preview" className="w-full h-full object-contain bg-gray-50" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-white rounded-full p-3 opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Camera className="w-6 h-6 text-gray-700" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <div className="bg-gray-100 rounded-full p-6 mb-4">
                      <ImagePlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-600 mb-2">Drop your image here</p>
                    <p className="text-sm text-gray-400">or click to browse • PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
              <Input
                id="image"
                type="file"
                name="image"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {/* Book Details */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Information</h2>
              <p className="text-gray-500">Tell us about your book</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Book Title</Label>
                <Input 
                  type="text" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  required 
                  className="h-12 rounded-xl border-black text-gray-500 focus:border-gray-400 focus:ring-gray-400"
                  placeholder="Enter the book title"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Author</Label>
                <Input 
                  type="text" 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  required 
                  className="h-12 rounded-xl border-black text-gray-500 focus:border-gray-400 focus:ring-gray-400"
                  placeholder="Author's name"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Price (₹)</Label>
                <Input 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                  className="h-12 rounded-xl border-black text-gray-500 focus:border-gray-400 focus:ring-gray-400"
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Department</Label>
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  className="w-full h-12 border border-black text-gray-500 rounded-xl px-4 focus:border-gray-900 focus:ring-gray-900 focus:ring-1 outline-none" 
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Academic Year</Label>
                <select 
                  name="year" 
                  value={formData.year} 
                  onChange={handleChange} 
                  className="w-full h-12 border border-black text-gray-500 rounded-xl px-4 focus:border-gray-900 focus:ring-gray-900 focus:ring-1 outline-none" 
                  required
                >
                  <option value="">Select Year</option>
                  {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Condition</Label>
                <select 
                  name="condition" 
                  value={formData.condition} 
                  onChange={handleChange} 
                  className="w-full h-12 border border-black text-gray-500 rounded-xl px-4 focus:border-gray-900 focus:ring-gray-900 focus:ring-1 outline-none" 
                  required
                >
                  <option value="">Select Condition</option>
                  {bookConditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Subjects Covered</Label>
                <Textarea 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required 
                  className="min-h-[100px] rounded-xl border-black text-gray-500 focus:border-gray-900 focus:ring-gray-900 resize-none"
                  placeholder="List the main subjects or topics covered in this book"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Additional Notes</Label>
                <Textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  className="min-h-[100px] rounded-xl border-black text-gray-500 focus:border-gray-900 focus:ring-gray-900 resize-none"
                  placeholder="Any additional information about the book's condition, markings, included materials, etc. (optional)"
                />
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
              <p className="text-gray-500">How buyers can reach you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="text" 
                    name="sellerName" 
                    value={formData.sellerName} 
                    onChange={handleChange} 
                    required 
                    className="h-12 pl-12 rounded-xl border-black text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="email" 
                    name="sellerEmail" 
                    value={formData.sellerEmail} 
                    onChange={handleChange} 
                    required 
                    className="h-12 pl-12 rounded-xl border-black text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="tel" 
                    name="sellerPhone" 
                    value={formData.sellerPhone} 
                    onChange={handleChange} 
                    required 
                    className="h-12 pl-12 rounded-xl border-black text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-black uppercase tracking-wide">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    required 
                    className="h-12 pl-12 rounded-xl border-black text-gray-500 focus:border-gray-900 focus:ring-gray-900"
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 ">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full h-14 bg-[#9333ea] hover:bg-[#9333ea] hover:opacity-70 text-white font-medium rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Listing Your Book...
                </div>
              ) : (
                'List Your Book'
              )}
            </Button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              By listing your book, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}