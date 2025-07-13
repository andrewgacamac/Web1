require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');

const app = express();

// Trust proxy settings - must be first
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Global middleware
app.use(compression()); // Compress responses
app.use(morgan('combined')); // Request logging
app.use(cors()); // Enable CORS
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'"],
    },
  },
}));
app.use(express.json()); // Parse JSON bodies

// Load Swagger document safely
let swaggerDocument;
try {
  swaggerDocument = YAML.load('./swagger.yaml');
} catch (error) {
  console.warn('Swagger document not found or invalid, API docs disabled');
  swaggerDocument = null;
}

// Serve static files with proper content types
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    // Add cache control headers
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// Middleware configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for static files
    return req.path.startsWith('/public/') || 
           req.path.endsWith('.css') || 
           req.path.endsWith('.js') || 
           req.path.endsWith('.png') || 
           req.path.endsWith('.jpg') || 
           req.path.endsWith('.jpeg') || 
           req.path.endsWith('.avif') || 
           req.path.endsWith('.svg') || 
           req.path.endsWith('.ico');
  }
});

// Apply rate limiting to API routes only
app.use('/api', limiter);

// API versioning middleware
const apiVersion = '1.0.0';
app.use((req, res, next) => {
  res.setHeader('X-API-Version', apiVersion);
  next();
});

// Request/Response transformation middleware
app.use((req, res, next) => {
  // Extend response object with custom methods
  res.sendSuccess = function(data) {
    return res.json({
      success: true,
      data,
      apiVersion
    });
  };

  res.sendError = function(message, statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      error: message,
      apiVersion
    });
  };

  next();
});

// API Documentation (only if swagger document exists)
if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// API Routes (v1)
const v1Router = express.Router();

// API endpoints go here
app.use('/api/v1', v1Router);

// Serve HTML files with error handling
app.get('*.html', (req, res, next) => {
  const filePath = path.join(__dirname, 'public', req.path);
  res.sendFile(filePath, (err) => {
    if (err) {
      next(err);
    }
  });
});

// Fallback route for SPA-like behavior with error handling
app.get('*', (req, res, next) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'public/index.html'), (err) => {
      if (err) {
        res.status(404).sendError('Page Not Found', 404);
      }
    });
  } else {
    res.status(404).sendError('Not Found', 404);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Different error responses based on error type
  if (err.type === 'rate.limit.exceeded') {
    return res.status(429).sendError('Too Many Requests', 429);
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).sendError(err.message, 400);
  }
  
  // Default error response
  res.status(500).sendError('Internal Server Error');
});

// Start the server
const server = app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
  console.log(`API Documentation available at http://${host}:${port}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});