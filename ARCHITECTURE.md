# Web2 Project Architecture Documentation

## 1. System Overview
**Project Type**: Node.js/Express Web Application  
**Primary Function**: Static website hosting with server-side routing  
**Key Technologies**:
- Node.js (v18+)
- Express.js 4.x
- Helmet (Security Middleware)
- Prettier/ESLint (Code Quality)

## 2. Application Architecture

```text
               ┌─────────────┐
               │   Client     │
               │ (Browser)    │
               └──────┬──────┘
                      │
               ┌──────▼──────┐
               │  Express     │
               │  Server      │
               └──────┬──────┘
                      │
               ┌──────▼──────┐
               │ Static File │
               │  Serving    │
               │ (public/)   │
               └─────────────┘
```

## 3. Directory Structure
```
├── app.js              # Main application entry point
├── package.json        # Project configuration and dependencies
├── .env                # Environment configuration
└── public/             # Static assets
    ├── index.html      # Home page
    ├── about.html      # About page
    ├── contact.html    # Contact page
    ├── faq.html        # FAQ page
    ├── portfolio.html  # Portfolio page
    └── styles.css      # Global stylesheet
```

## 4. Key Dependencies
**Production**:
- `express@4.19.2`: Web framework
- `helmet@7.1.0`: Security headers
- `dotenv@16.4.1`: Environment management

**Development**:
- `nodemon@3.1.0`: Development server
- `eslint@8.56.0`: Code linting
- `prettier@3.2.5`: Code formatting

## 5. Routing Architecture
| Route        | Method | Handler              | View Template      |
|--------------|--------|----------------------|--------------------|
| /            | GET    | Home page            | public/index.html  |
| /about       | GET    | About page           | public/about.html  |
| /contact     | GET    | Contact page         | public/contact.html|
| /faq         | GET    | FAQ page             | public/faq.html    |
| /portfolio   | GET    | Portfolio page       | public/portfolio.html |

## 6. Styling Architecture
**Core Features**:
- CSS Custom Properties
- Mobile-first responsive design
- BEM-like naming conventions
- Modular component structure

**Key CSS Components**:
- Navigation system (desktop/mobile)
- Hero sections
- Card-based layouts
- Contact forms
- FAQ accordion system
- Portfolio grid

## 7. Environment Configuration
```ini
PORT=3000             # Server listening port
HOST=0.0.0.0         # Server binding address
NODE_ENV=development # Runtime environment
```

## 8. Deployment Configuration
**Start Script**:
```bash
npm start  # Production: node app.js
npm run dev # Development: nodemon app.js
```

**Port Binding**:
- Default: 3000
- Configurable via PORT environment variable

## 9. Security Features
- Helmet middleware enabled
- Content Security Policy (CSP) disabled in development
- Environment variables for sensitive configuration
- Static file serving with Express

## 10. Future Considerations
1. Implement proper CSP configuration
2. Add error tracking (Sentry/New Relic)
3. Introduce build process for CSS/JS
4. Add automated testing framework
5. Implement caching strategies
6. Add proper 404/500 error pages