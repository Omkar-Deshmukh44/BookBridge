// models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  // Book Details
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  year: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  condition: { type: String, required: true, enum: ['Like New', 'Good', 'Fair', 'Acceptable'] },
  description: { type: String, trim: true },
  
  // Image
  imageUrl: { type: String, required: true },
  imagePublicId: String,
  
  // Seller Details
  sellerName: { type: String, required: true, trim: true },
  sellerEmail: { type: String, required: true, trim: true, lowercase: true },
  sellerPhone: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  
  // Metadata
  status: { type: String, default: 'available', enum: ['available', 'sold', 'reserved'] },
}, {
  timestamps: true
});

// Indexes for efficient filtering
bookSchema.index({ department: 1, year: 1 });
bookSchema.index({ subject: 'text', title: 'text', author: 'text' });
bookSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('Book', bookSchema);