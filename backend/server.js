const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const MESSAGES_DIR = path.join(__dirname, 'messages');

// Trust proxy must be first
app.set('trust proxy', 1);

// Rate limiting setup
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 500, // Limit each IP to 500 requests per minute
    standardHeaders: true,
    legacyHeaders: false
});

// Apply rate limiting to all routes
app.use(limiter);

// Ensure messages directory exists
if (!fs.existsSync(MESSAGES_DIR)) {
    fs.mkdirSync(MESSAGES_DIR, { recursive: true });
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST');
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Input validation
function validateInput(body) {
    const { name, email, message } = body;
    
    if (!name || !email || !message) {
        return { valid: false, error: 'All fields are required' };
    }
    
    if (message.length > 2000) {
        return { valid: false, error: 'Message is too long (max 2000 characters)' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }
    
    return { valid: true };
}

// Sanitize filename
function sanitizeFilename(str) {
    return str.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Message handling endpoint
app.post('/api/message', (req, res) => {
    // Validate input
    const validation = validateInput(req.body);
    if (!validation.valid) {
        return res.status(400).json({
            success: false,
            error: validation.error
        });
    }

    const { name, email, message } = req.body;
    
    // Create message content
    const timestamp = new Date().toISOString();
    const messageContent = `From: ${name} <${email}>
Date: ${timestamp}
--
${message}`;

    // Generate unique filename
    const filename = `${sanitizeFilename(name)}_${uuidv4()}.txt`;
    const filepath = path.join(MESSAGES_DIR, filename);

    // Save message to file
    try {
        // Ensure messages directory exists again (just in case)
        if (!fs.existsSync(MESSAGES_DIR)) {
            fs.mkdirSync(MESSAGES_DIR, { recursive: true });
        }

        // Write file with proper permissions (readable/writable by owner only)
        fs.writeFileSync(filepath, messageContent, { mode: 0o600 });
        
        console.log(`Message saved successfully: ${filename}`);
        
        res.json({
            success: true,
            message: 'Message saved successfully'
        });
    } catch (error) {
        console.error('Error saving message:', error);
        console.error('File path:', filepath);
        console.error('Directory:', MESSAGES_DIR);
        
        res.status(500).json({
            success: false,
            error: 'Failed to save message. Please try again later.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});