// server.js
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (using top-level await; Node 14+ in ES module mode)
await mongoose.connect('mongodb://localhost:27017/eduSphere', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log('MongoDB connected at mongodb://localhost:27017/eduSphere');

// Define User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return v.endsWith('@vit.edu');
      },
      message: 'Email must be a valid college email (@vit.edu)',
    },
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['student', 'staff'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

// Registration Route
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;

    // Validate email domain
    if (!email.endsWith('@vit.edu')) {
      return res.status(400).json({ error: 'Please use your college email (@vit.edu)' });
    }

    // Check if user already exists (by email or username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      userType,
    });
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ user: userResponse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify user type
    if (user.userType !== userType) {
      return res.status(401).json({ error: 'Invalid user type' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ user: userResponse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User Profile Route
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
