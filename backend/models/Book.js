const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        trim: true,
        maxlength: [100, 'Author name cannot be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        max: [10000, 'Price cannot exceed $10,000']
    },
    publishedDate: {
        type: Date,
        required: [true, 'Published date is required'],
        validate: {
            validator: function(v) {
                return v <= new Date();
            },
            message: 'Published date cannot be in the future'
        }
    },
    isbn: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        match: [/^(?:\d{10}|\d{13})$/, 'ISBN must be 10 or 13 digits']
    },
    genre: {
        type: String,
        enum: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Mystery', 'Romance', 'Biography', 'History', 'Self-Help', 'Other'],
        default: 'Other'
    },
    description: {
        type: String,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    coverImage: {
        type: String,
        match: [/^https?:\/\/.+/, 'Cover image must be a valid URL']
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be negative']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for formatted price
bookSchema.virtual('formattedPrice').get(function() {
    return `$${this.price.toFixed(2)}`;
});

// Virtual for age of book
bookSchema.virtual('age').get(function() {
    const now = new Date();
    const published = new Date(this.publishedDate);
    const ageInYears = now.getFullYear() - published.getFullYear();
    return ageInYears;
});

// Index for better query performance
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ publishedDate: -1 });

// Pre-save middleware to capitalize title and author
bookSchema.pre('save', function(next) {
    if (this.title) {
        this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1).toLowerCase();
    }
    if (this.author) {
        this.author = this.author.charAt(0).toUpperCase() + this.author.slice(1).toLowerCase();
    }
    next();
});

module.exports = mongoose.model('Book', bookSchema);