import Marketplace from "../models/Marketplace.js";
import User from "../models/User.js";

// Create a new marketplace listing
export const createListing = async (req, res) => {
  try {
    const listingData = req.body;
    listingData.seller = req.user.userId;

    const listing = new Marketplace(listingData);
    const savedListing = await listing.save();

    // Populate seller information
    await savedListing.populate('seller', 'name email phone');

    res.status(201).json({
      message: "Marketplace listing created successfully",
      listing: savedListing
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating listing", error: error.message });
  }
};

// Get all marketplace listings
export const getListings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      minPrice, 
      maxPrice,
      location,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = { 
      isActive: true, 
      isApproved: true,
      'availability.status': 'available'
    };

    // Add filters
    if (category) query['product.category'] = category;
    if (minPrice || maxPrice) {
      query['product.price'] = {};
      if (minPrice) query['product.price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['product.price'].$lte = parseFloat(maxPrice);
    }
    if (location) {
      query['location.name'] = new RegExp(location, 'i');
    }
    if (search) {
      query.$or = [
        { 'product.name': new RegExp(search, 'i') },
        { 'product.description': new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const listings = await Marketplace.find(query)
      .populate('seller', 'name email phone address')
      .populate('reviews.buyer', 'name')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Marketplace.countDocuments(query);

    res.status(200).json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching listings", error: error.message });
  }
};

// Get listing by ID
export const getListingById = async (req, res) => {
  try {
    const listing = await Marketplace.findByIdAndUpdate(
      req.params.id,
      { $inc: { 'statistics.views': 1 } },
      { new: true }
    )
    .populate('seller', 'name email phone address bio')
    .populate('orders.buyer', 'name email phone')
    .populate('reviews.buyer', 'name profileImage');

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: "Error fetching listing", error: error.message });
  }
};

// Get listings by seller
export const getListingsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const listings = await Marketplace.find({ 
      seller: sellerId, 
      isActive: true 
    })
    .populate('orders.buyer', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Marketplace.countDocuments({ 
      seller: sellerId, 
      isActive: true 
    });

    res.status(200).json({
      listings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller listings", error: error.message });
  }
};

// Create order
export const createOrder = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { quantity, deliveryAddress, notes } = req.body;
    const buyerId = req.user.userId;

    const listing = await Marketplace.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.availability.status !== 'available') {
      return res.status(400).json({ message: "Product is not available" });
    }

    if (quantity > listing.availability.availableQuantity) {
      return res.status(400).json({ message: "Insufficient quantity available" });
    }

    const totalPrice = quantity * listing.product.price;

    const order = {
      buyer: buyerId,
      quantity,
      totalPrice,
      deliveryAddress,
      notes,
      orderDate: new Date()
    };

    listing.orders.push(order);
    listing.availability.availableQuantity -= quantity;
    listing.availability.reservedQuantity += quantity;

    if (listing.availability.availableQuantity === 0) {
      listing.availability.status = 'sold_out';
    }

    await listing.save();

    res.status(201).json({
      message: "Order created successfully",
      order: {
        ...order,
        product: listing.product.name,
        seller: listing.seller
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { listingId, orderId } = req.params;
    const { status, deliveryDate } = req.body;

    const listing = await Marketplace.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const order = listing.orders.id(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    if (deliveryDate) order.deliveryDate = deliveryDate;

    // Update availability based on status
    if (status === 'delivered') {
      listing.availability.reservedQuantity -= order.quantity;
      listing.statistics.totalSold += order.quantity;
    } else if (status === 'cancelled') {
      listing.availability.reservedQuantity -= order.quantity;
      listing.availability.availableQuantity += order.quantity;
      if (listing.availability.status === 'sold_out') {
        listing.availability.status = 'available';
      }
    }

    await listing.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

// Add review
export const addReview = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { rating, comment } = req.body;
    const buyerId = req.user.userId;

    const listing = await Marketplace.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user has ordered this product
    const hasOrdered = listing.orders.some(order => 
      order.buyer.toString() === buyerId && order.status === 'delivered'
    );

    if (!hasOrdered) {
      return res.status(400).json({ message: "You can only review products you've purchased" });
    }

    // Check if user has already reviewed
    const existingReview = listing.reviews.find(review => 
      review.buyer.toString() === buyerId
    );

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const review = {
      buyer: buyerId,
      rating,
      comment,
      date: new Date(),
      verified: true
    };

    listing.reviews.push(review);

    // Update average rating
    const totalRating = listing.reviews.reduce((sum, r) => sum + r.rating, 0);
    listing.statistics.averageRating = Math.round((totalRating / listing.reviews.length) * 10) / 10;

    await listing.save();

    res.status(201).json({
      message: "Review added successfully",
      review
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error: error.message });
  }
};

// Get nearby listings
export const getNearbyListings = async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required" });
    }

    const listings = await Marketplace.find({
      isActive: true,
      isApproved: true,
      'availability.status': 'available',
      'location.coordinates.latitude': {
        $gte: parseFloat(latitude) - (radius / 111),
        $lte: parseFloat(latitude) + (radius / 111)
      },
      'location.coordinates.longitude': {
        $gte: parseFloat(longitude) - (radius / 111),
        $lte: parseFloat(longitude) + (radius / 111)
      }
    })
    .populate('seller', 'name email phone')
    .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching nearby listings", error: error.message });
  }
};

// Update listing
export const updateListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.seller;
    delete updateData.createdAt;
    delete updateData.orders;
    delete updateData.reviews;
    delete updateData.statistics;

    const listing = await Marketplace.findByIdAndUpdate(
      listingId,
      updateData,
      { new: true, runValidators: true }
    ).populate('seller', 'name email phone');

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({
      message: "Listing updated successfully",
      listing
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating listing", error: error.message });
  }
};

// Delete listing
export const deleteListing = async (req, res) => {
  try {
    const listing = await Marketplace.findByIdAndUpdate(
      req.params.listingId,
      { isActive: false },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json({
      message: "Listing deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting listing", error: error.message });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Marketplace.distinct('product.category', {
      isActive: true,
      isApproved: true
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

// Get featured listings
export const getFeaturedListings = async (req, res) => {
  try {
    const listings = await Marketplace.find({
      isActive: true,
      isApproved: true,
      featured: true,
      'availability.status': 'available',
      $or: [
        { featuredUntil: { $exists: false } },
        { featuredUntil: { $gt: new Date() } }
      ]
    })
    .populate('seller', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(10);

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured listings", error: error.message });
  }
};
