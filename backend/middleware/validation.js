import { body, param, query, validationResult } from 'express-validator';

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors: formattedErrors
    });
  };
};

// User validation rules
export const validateUserRegistration = validate([
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .isIn(['admin', 'gardener', 'volunteer', 'landowner', 'expert'])
    .withMessage('Invalid role selected'),
  
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  
  body('address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('address.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters')
]);

export const validateUserLogin = validate([
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]);

// Land validation rules
export const validateLandCreation = validate([
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('location.coordinates.latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('location.coordinates.longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  body('area.total')
    .isFloat({ min: 0.01 })
    .withMessage('Total area must be greater than 0'),
  
  body('area.available')
    .isFloat({ min: 0 })
    .withMessage('Available area cannot be negative'),
  
  body('soilType')
    .optional()
    .isIn(['clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky', 'unknown'])
    .withMessage('Invalid soil type'),
  
  body('waterSource')
    .optional()
    .isIn(['well', 'borewell', 'canal', 'rainwater', 'municipal', 'other'])
    .withMessage('Invalid water source')
]);

// Task validation rules
export const validateTaskCreation = validate([
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  
  body('land')
    .isMongoId()
    .withMessage('Invalid land ID'),
  
  body('assignedTo')
    .isMongoId()
    .withMessage('Invalid assigned user ID'),
  
  body('category')
    .isIn(['planting', 'watering', 'fertilizing', 'harvesting', 'maintenance', 'monitoring', 'other'])
    .withMessage('Invalid task category'),
  
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  
  body('dueDate')
    .isISO8601()
    .withMessage('Invalid due date format'),
  
  body('estimatedDuration')
    .optional()
    .isFloat({ min: 0.5, max: 24 })
    .withMessage('Estimated duration must be between 0.5 and 24 hours')
]);

// Progress validation rules
export const validateProgressCreation = validate([
  body('land')
    .isMongoId()
    .withMessage('Invalid land ID'),
  
  body('crop.name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Crop name must be between 2 and 50 characters'),
  
  body('crop.plantingDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid planting date format'),
  
  body('growthStage')
    .optional()
    .isIn(['planting', 'germination', 'vegetative', 'flowering', 'fruiting', 'harvesting', 'completed'])
    .withMessage('Invalid growth stage')
]);

// Community post validation rules
export const validatePostCreation = validate([
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters'),
  
  body('type')
    .isIn(['update', 'tip', 'question', 'event', 'success_story', 'announcement', 'marketplace'])
    .withMessage('Invalid post type'),
  
  body('category')
    .optional()
    .isIn(['general', 'farming', 'gardening', 'marketplace', 'events', 'education', 'community'])
    .withMessage('Invalid post category')
]);

// Marketplace validation rules
export const validateMarketplaceListing = validate([
  body('product.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('product.description')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Product description must be between 10 and 500 characters'),
  
  body('product.category')
    .isIn(['vegetables', 'fruits', 'grains', 'herbs', 'seeds', 'tools', 'fertilizers', 'other'])
    .withMessage('Invalid product category'),
  
  body('product.quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be greater than 0'),
  
  body('product.unit')
    .isIn(['kg', 'grams', 'tons', 'quintals', 'pieces', 'liters', 'packets', 'bunches'])
    .withMessage('Invalid unit'),
  
  body('product.price')
    .isFloat({ min: 0.01 })
    .withMessage('Price must be greater than 0'),
  
  body('availability.availableQuantity')
    .isFloat({ min: 0 })
    .withMessage('Available quantity cannot be negative')
]);

// Order validation rules
export const validateOrderCreation = validate([
  body('quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be greater than 0'),
  
  body('deliveryAddress.street')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters'),
  
  body('deliveryAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  
  body('deliveryAddress.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  
  body('deliveryAddress.pincode')
    .optional()
    .isPostalCode('IN')
    .withMessage('Invalid pincode format')
]);

// Review validation rules
export const validateReviewCreation = validate([
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters')
]);

// Parameter validation
export const validateObjectId = validate([
  param('id').isMongoId().withMessage('Invalid ID format')
]);

export const validateUserId = validate([
  param('userId').isMongoId().withMessage('Invalid user ID format')
]);

export const validateLandId = validate([
  param('landId').isMongoId().withMessage('Invalid land ID format')
]);

export const validateTaskId = validate([
  param('taskId').isMongoId().withMessage('Invalid task ID format')
]);

export const validateProgressId = validate([
  param('progressId').isMongoId().withMessage('Invalid progress ID format')
]);

export const validatePostId = validate([
  param('postId').isMongoId().withMessage('Invalid post ID format')
]);

export const validateListingId = validate([
  param('listingId').isMongoId().withMessage('Invalid listing ID format')
]);

// Query validation
export const validatePagination = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
]);

export const validateLocationQuery = validate([
  query('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  query('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  query('radius')
    .optional()
    .isFloat({ min: 0.1, max: 100 })
    .withMessage('Radius must be between 0.1 and 100 km')
]);
