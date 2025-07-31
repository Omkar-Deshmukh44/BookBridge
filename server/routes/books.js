// routes/books.js - Enhanced with better filtering and sorting
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import Book from '../models/Book.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log('📁 File received:', file.originalname, file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST /api/books - Create new book listing
router.post('/', upload.single('image'), async (req, res) => {
  console.log('📚 Book creation request received');
  console.log('📋 Request body:', req.body);
  console.log('🖼️ File info:', req.file ? {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  } : 'No file');

  try {
    const {
      title, author, department, year, subject, price, condition, description,
      sellerName, sellerEmail, sellerPhone, location
    } = req.body;

    // Validate required fields
    const requiredFields = ['title', 'author', 'department', 'year', 'subject', 'price', 'condition', 'sellerName', 'sellerEmail', 'sellerPhone', 'location'];
    const missingFields = requiredFields.filter(field => !req.body[field] || req.body[field].toString().trim() === '');
    
    if (missingFields.length > 0) {
      console.log('❌ Missing fields:', missingFields);
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields
      });
    }

    if (!req.file) {
      console.log('❌ No image file provided');
      return res.status(400).json({ error: 'Book image is required' });
    }

    console.log('☁️ Uploading to Cloudinary...');
    
    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'book-marketplace',
          transformation: [
            { width: 800, height: 1000, crop: 'limit' },
            { quality: 'auto:good' }
          ]
        },
        (error, result) => {
          if (error) {
            console.log('❌ Cloudinary error:', error);
            reject(error);
          } else {
            console.log('✅ Cloudinary upload successful:', result.secure_url);
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    console.log('📝 Creating book record...');

    // Create book record
    const book = new Book({
      title: title.trim(),
      author: author.trim(),
      department: department.trim(),
      year: year.trim(),
      subject: subject.trim(),
      price: parseFloat(price),
      condition: condition.trim(),
      description: description?.trim() || '',
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
      sellerName: sellerName.trim(),
      sellerEmail: sellerEmail.trim().toLowerCase(),
      sellerPhone: sellerPhone.trim(),
      location: location.trim()
    });

    const savedBook = await book.save();
    console.log('✅ Book saved successfully:', savedBook._id);

    res.status(201).json({
      message: 'Book listed successfully',
      book: {
        id: savedBook._id,
        title: savedBook.title,
        author: savedBook.author,
        department: savedBook.department,
        year: savedBook.year,
        price: savedBook.price,
        imageUrl: savedBook.imageUrl,
        createdAt: savedBook.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Error creating book listing:', error);
    
    // Send more detailed error info
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation Error',
        details: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to create book listing',
      details: error.message 
    });
  }
});

// Test route to check if books route is working
router.get('/test', (req, res) => {
  res.json({ message: 'Books route is working!' });
});

// GET /api/books - Get all books with enhanced filtering and sorting
router.get('/', async (req, res) => {
  try {
    console.log('📖 Fetching books with filters:', req.query);

    const query = { status: { $in: ['available', null, undefined] } }; // Only show available books

    // Search functionality - improved to handle multiple fields
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { author: searchRegex },
        { subject: searchRegex },
        { sellerName: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filter by department
    if (req.query.department && req.query.department !== '') {
      query.department = req.query.department;
    }

    // Filter by year
    if (req.query.year && req.query.year !== '') {
      query.year = req.query.year;
    }

    // Filter by subject
    if (req.query.subject && req.query.subject !== '') {
      query.subject = req.query.subject;
    }

    // Filter by condition
    if (req.query.condition && req.query.condition !== '') {
      query.condition = req.query.condition;
    }

    // Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Sorting options - enhanced with more options
    let sortOption = { createdAt: -1 }; // default: newest first
    
    switch (req.query.sortBy) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'price_low':
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price_high':
      case 'price-high':
        sortOption = { price: -1 };
        break;
      case 'title':
        sortOption = { title: 1 };
        break;
      case 'author':
        sortOption = { author: 1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    console.log('🔍 Query:', JSON.stringify(query, null, 2));
    console.log('📊 Sort:', sortOption);

    const books = await Book.find(query)
      .sort(sortOption)
      .lean(); // Use lean() for better performance

    console.log(`✅ Found ${books.length} books`);

    res.json({ 
      books, 
      count: books.length,
      query: req.query,
      success: true 
    });

  } catch (error) {
    console.error('❌ Error fetching books:', error);
    res.status(500).json({ 
      error: 'Failed to fetch books',
      details: error.message,
      success: false 
    });
  }
});

// GET /api/books/stats - Get statistics for filters
router.get('/stats', async (req, res) => {
  try {
    const stats = await Book.aggregate([
      { $match: { status: { $in: ['available', null, undefined] } } },
      {
        $group: {
          _id: null,
          departments: { $addToSet: '$department' },
          years: { $addToSet: '$year' },
          subjects: { $addToSet: '$subject' },
          conditions: { $addToSet: '$condition' },
          totalBooks: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const result = stats[0] || {
      departments: [],
      years: [],
      subjects: [],
      conditions: [],
      totalBooks: 0,
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0
    };

    res.json({
      success: true,
      stats: result
    });

  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      details: error.message,
      success: false 
    });
  }
});

// GET /api/books/:id - Get single book details
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ 
        error: 'Book not found',
        success: false 
      });
    }

    res.json({ 
      book,
      success: true 
    });

  } catch (error) {
    console.error('❌ Error fetching book:', error);
    res.status(500).json({ 
      error: 'Failed to fetch book details',
      details: error.message,
      success: false 
    });
  }
});

// PUT /api/books/:id/status - Update book status (mark as sold/available)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['available', 'sold', 'reserved'].includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be available, sold, or reserved',
        success: false 
      });
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({ 
        error: 'Book not found',
        success: false 
      });
    }

    res.json({ 
      message: `Book status updated to ${status}`,
      book,
      success: true 
    });

  } catch (error) {
    console.error('❌ Error updating book status:', error);
    res.status(500).json({ 
      error: 'Failed to update book status',
      details: error.message,
      success: false 
    });
  }
});

export default router;