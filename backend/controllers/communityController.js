import Community from "../models/Community.js";
import User from "../models/User.js";

// Create a new community post
export const createPost = async (req, res) => {
  try {
    const postData = req.body;
    postData.author = req.user.userId; // Assuming middleware sets req.user

    const post = new Community(postData);
    const savedPost = await post.save();

    // Populate the saved post with author data
    await savedPost.populate('author', 'name email role profileImage');

    res.status(201).json({
      message: "Post created successfully",
      post: savedPost
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};

// Get all community posts
export const getPosts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      category, 
      tags,
      authorId,
      search 
    } = req.query;

    let query = { isActive: true, isApproved: true };

    // Add filters
    if (type) query.type = type;
    if (category) query.category = category;
    if (authorId) query.author = authorId;
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    if (search) {
      query.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const posts = await Community.find(query)
      .populate('author', 'name email role profileImage')
      .populate('comments.author', 'name email role profileImage')
      .populate('comments.replies.author', 'name email role profileImage')
      .populate('marketplace.seller', 'name email phone')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Community.countDocuments(query);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

// Get post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Community.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
    .populate('author', 'name email role profileImage bio')
    .populate('comments.author', 'name email role profileImage')
    .populate('comments.replies.author', 'name email role profileImage')
    .populate('marketplace.seller', 'name email phone address')
    .populate('event.registeredParticipants.user', 'name email phone');

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};

// Like/Unlike a post
export const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Community.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = post.likes.find(like => like.user.toString() === userId);
    
    if (existingLike) {
      // Unlike
      post.likes = post.likes.filter(like => like.user.toString() !== userId);
    } else {
      // Like
      post.likes.push({ user: userId });
    }

    await post.save();

    res.status(200).json({
      message: existingLike ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error: error.message });
  }
};

// Add comment to post
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const comment = {
      author: userId,
      content,
      date: new Date()
    };

    const post = await Community.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true, runValidators: true }
    ).populate('comments.author', 'name email role profileImage');

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Comment added successfully",
      post
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

// Reply to comment
export const replyToComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const reply = {
      author: userId,
      content,
      date: new Date()
    };

    const post = await Community.findOneAndUpdate(
      { 
        _id: postId, 
        'comments._id': commentId 
      },
      { $push: { 'comments.$.replies': reply } },
      { new: true, runValidators: true }
    ).populate('comments.author', 'name email role profileImage')
     .populate('comments.replies.author', 'name email role profileImage');

    if (!post) {
      return res.status(404).json({ message: "Post or comment not found" });
    }

    res.status(200).json({
      message: "Reply added successfully",
      post
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding reply", error: error.message });
  }
};

// Register for event
export const registerForEvent = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Community.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (post.type !== 'event') {
      return res.status(400).json({ message: "This is not an event post" });
    }

    // Check if user is already registered
    const existingRegistration = post.event.registeredParticipants.find(
      p => p.user.toString() === userId
    );

    if (existingRegistration) {
      return res.status(400).json({ message: "Already registered for this event" });
    }

    // Check if event is full
    if (post.event.maxParticipants && 
        post.event.registeredParticipants.length >= post.event.maxParticipants) {
      return res.status(400).json({ message: "Event is full" });
    }

    post.event.registeredParticipants.push({
      user: userId,
      registeredAt: new Date()
    });

    await post.save();

    res.status(200).json({
      message: "Successfully registered for event",
      registeredCount: post.event.registeredParticipants.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering for event", error: error.message });
  }
};

// Buy marketplace item
export const buyMarketplaceItem = async (req, res) => {
  try {
    const { postId } = req.params;
    const { quantity, amount } = req.body;
    const userId = req.user.userId;

    const post = await Community.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Marketplace item not found" });
    }

    if (post.type !== 'marketplace') {
      return res.status(400).json({ message: "This is not a marketplace post" });
    }

    if (post.marketplace.availability !== 'available') {
      return res.status(400).json({ message: "Item is not available" });
    }

    // Update marketplace item
    post.marketplace.availability = 'sold';
    post.marketplace.soldTo = {
      buyer: userId,
      soldAt: new Date(),
      amount: amount || post.marketplace.product.price
    };

    await post.save();

    res.status(200).json({
      message: "Item purchased successfully",
      post
    });
  } catch (error) {
    res.status(500).json({ message: "Error purchasing item", error: error.message });
  }
};

// Get posts by type
export const getPostsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Community.find({ 
      type, 
      isActive: true, 
      isApproved: true 
    })
    .populate('author', 'name email role profileImage')
    .populate('marketplace.seller', 'name email phone')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Community.countDocuments({ 
      type, 
      isActive: true, 
      isApproved: true 
    });

    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts by type", error: error.message });
  }
};

// Get marketplace items
export const getMarketplaceItems = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      minPrice, 
      maxPrice,
      location 
    } = req.query;

    let query = { 
      type: 'marketplace', 
      isActive: true, 
      isApproved: true,
      'marketplace.availability': 'available'
    };

    if (category) query['marketplace.product.category'] = category;
    if (minPrice || maxPrice) {
      query['marketplace.product.price'] = {};
      if (minPrice) query['marketplace.product.price'].$gte = parseFloat(minPrice);
      if (maxPrice) query['marketplace.product.price'].$lte = parseFloat(maxPrice);
    }
    if (location) {
      query['location.name'] = new RegExp(location, 'i');
    }

    const posts = await Community.find(query)
      .populate('author', 'name email role profileImage')
      .populate('marketplace.seller', 'name email phone address')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Community.countDocuments(query);

    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching marketplace items", error: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData.author;
    delete updateData.createdAt;
    delete updateData.likes;
    delete updateData.comments;
    delete updateData.shares;

    const post = await Community.findByIdAndUpdate(
      postId,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email role profileImage');

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post updated successfully",
      post
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Community.findByIdAndUpdate(
      req.params.postId,
      { isActive: false },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

// Pin/Unpin post (Admin only)
export const togglePin = async (req, res) => {
  try {
    const { postId } = req.params;
    const { isPinned } = req.body;

    const post = await Community.findByIdAndUpdate(
      postId,
      { isPinned },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: `Post ${isPinned ? 'pinned' : 'unpinned'} successfully`,
      post
    });
  } catch (error) {
    res.status(500).json({ message: "Error toggling pin", error: error.message });
  }
};
