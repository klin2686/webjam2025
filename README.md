<div align="center">
  <img src="frontend/public/githubHaloLogo.svg" alt="Halo Logo" width="280" height="123">

  ### Your Personalized Allergy Guardian Angel

  **AI-powered food allergy management for safer dining experiences**

  [Live Demo](https://halo-nine-gold.vercel.app) • [Report Bug](https://github.com/klin2686/halo/issues) • [Request Feature](https://github.com/klin2686/halo/issues)
</div>

---

# About

### The Problem

Severe allergic reactions in restaurants are alarmingly common, yet many menus lack complete allergen information. Restaurant staff are often misinformed or simply don't have access to detailed ingredient lists, putting diners with food allergies at risk.

### The Solution

Halo is an AI-powered food allergy management application that helps users safely navigate restaurant menus. Simply upload a menu photo or enter items manually, and Halo uses Google Gemini AI to identify potential allergens in each dish. Results are personalized with color-coded highlighting based on your specific allergy profile, giving you peace of mind when dining out.

### Why Halo?

- **Instant Analysis**: Get allergen information in seconds
- **AI-Powered Accuracy**: Leverages Google Gemini 2.5 Flash for intelligent menu analysis
- **Personalized Results**: Matches against your specific allergy profile
- **Confidence Transparency**: Every detection includes a confidence score (0-10)
- **FDA Aligned**: Covers all 9 major allergen categories recognized by the FDA

# Demo

<div align="center">
  <img src="https://github.com/user-attachments/assets/7193a1d3-b29a-4dfa-8a7b-ec610c5720cf" alt="Halo Sign In" width="800">
  <p><em>Clean, modern authentication with Google OAuth and email/password options</em></p>

  <img src="https://github.com/user-attachments/assets/a408ae76-db67-4a91-a9c3-cfd473f9cb85" alt="Halo Dashboard" width="800">
  <p><em>Intuitive dashboard with color-coded allergen detection and confidence scores</em></p>
</div>

# Features

### Authentication & User Management

- **Multiple Sign-In Options**: Google OAuth 2.0 or email/password authentication
- **Secure JWT Tokens**: Access and refresh token pattern for enhanced security
- **Profile Management**: Customize your name and profile picture
- **Password Management**: Change your password anytime with validation

### Allergy Profile Management

- **FDA Major Allergens**: Track allergies for all 9 FDA-recognized categories (Milk, Eggs, Fish, Shellfish, Tree Nuts, Peanuts, Wheat, Soybeans, Sesame)
- **Severity Levels**: Set severity ratings (Mild, Moderate, Severe) for each allergy
- **Easy Updates**: Add, modify, or remove allergies as needed
- **Visual Organization**: Allergies automatically ordered by severity

### AI-Powered Menu Analysis

- **Image Upload**: Supports JPG, PNG, HEIC, HEIF, and WebP formats
- **Smart Preprocessing**: Automatic image optimization, contrast enhancement, and EXIF orientation correction
- **Manual Entry**: Type in menu items when photos aren't available
- **Structured Results**: Each item shows name, allergens, and confidence score
- **Intelligent Detection**: Powered by Google Gemini 2.5 Flash

### Menu History & Management

- **Save Analysis**: Keep track of analyzed menus with custom names
- **Quick Access**: View all previously analyzed menus
- **Rename & Delete**: Organize your saved menus easily
- **Timestamps**: Track when each menu was analyzed

### User Interface

- **Color-Coded Results**: Instant visual identification of your specific allergens
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion-powered transitions
- **Modern Typography**: SF Pro font for a clean, Apple-inspired look
- **Mobile Navigation**: Intuitive sidebar drawer for small screens

# Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Flask** | Python WSGI web framework |
| **SQLAlchemy** | ORM and database management |
| **PostgreSQL** | Production database |
| **SQLite** | Development and testing database |
| **PyJWT** | JWT token authentication |
| **Google Gemini 2.5 Flash** | AI-powered menu analysis |
| **Google OAuth 2.0** | Social authentication |
| **Pillow** | Image processing and HEIC support |
| **Gunicorn** | Production WSGI server |
| **Flask-CORS** | Cross-origin resource sharing |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React** | UI framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animation library |

### Deployment & Infrastructure

- **Backend Hosting**: Heroku with PostgreSQL add-on
- **Frontend Hosting**: Vercel
- **Version Control**: Git & GitHub

# Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18 or higher (includes npm) - [Download](https://nodejs.org/)
- **Python**: 3.10 or higher (includes pip) - [Download](https://www.python.org/)
- **Git**: Version control - [Download](https://git-scm.com/)

You'll also need API keys:

- **Google Cloud Console**: For OAuth 2.0 credentials and Gemini API access
  - [Create a project](https://console.cloud.google.com/)
  - Obtain OAuth 2.0 credentials (web application)
  - Generate Gemini API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/klin2686/halo.git
   cd halo
   ```

2. For detailed setup instructions, see:
   - [Backend Setup Guide](backend/README.md)
   - [Frontend Setup Guide](frontend/README.md)

# Usage

### Quick Start Guide

1. **Create an account** or sign in with Google

2. **Set up your allergy profile**
   - Navigate to your allergy bar
   - Select allergies from the FDA's 9 major allergen categories
   - Set severity levels for each allergy

3. **Analyze a menu**
   - Go to the Dashboard
   - Upload a menu photo OR manually enter menu items
   - Wait for AI analysis (typically 10-20 seconds)

4. **Review results**
   - See allergens highlighted in color based on your dashboard
   - Check confidence scores for each detection
   - Items matching your allergies are prominently marked

5. **Save for later**
   - Give your menus a custom name in the History page
   - Access saved menus anytime

### Common Use Cases

- **Restaurant Dining**: Quickly scan menus before ordering
- **Takeout Orders**: Verify allergen information when ordering delivery
- **Travel Planning**: Save menus from your favorite safe restaurants
- **Group Dining**: Check multiple menu items at once for shared meals

# Project Structure

This is a **monorepo** containing both the backend API and frontend application:

```text
halo/
├── backend/                      # Flask API server
│   ├── app/
│   │   ├── models/               # Database models (User, Allergen, MenuUpload, UserAllergy)
│   │   ├── routes/               # API endpoints (auth, allergy, menu processing)
│   │   ├── utils/                # Helper functions (JWT, OAuth, validators)
│   │   ├── config.py             # App configuration classes
│   │   └── extensions.py         # Flask extensions
│   ├── instance/                 # SQLite database (gitignored)
│   ├── run.py                    # Server entry point
│   ├── seed_db.py                # Database seeding script
│   ├── requirements.txt          # Python dependencies
│   ├── Procfile                  # Heroku deployment config
│   ├── API_REFERENCE.md          # Complete API documentation
│   └── README.md                 # Backend setup instructions
│
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── contexts/             # React context
│   │   ├── hooks/                # Custom hooks
│   │   ├── utils/                # API client, animations
│   │   └── assets/               # Images, fonts, icons
│   ├── public/                   # Static assets
│   ├── package.json              # npm dependencies
│   ├── vite.config.ts            # Vite configuration
│   ├── tailwind.config.js        # Tailwind customization
│   ├── vercel.json               # Vercel deployment config
│   └── README.md                 # Frontend setup instructions
│
├── README.md                     # This file
├── LICENSE                       # Project license
└── .gitignore                    # Git ignore rules
```

# API Documentation

Comprehensive API documentation is available in [backend/API_REFERENCE.md](backend/API_REFERENCE.md).

## API Endpoints Overview

### Authentication

- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Allergy Management

- `GET /api/allergy` - Get user allergies
- `POST /api/allergy` - Add new allergy
- `PUT /api/allergy/<id>` - Update allergy severity
- `DELETE /api/allergy/<id>` - Remove allergy

### Menu Processing

- `POST /api/process-menu` - Upload and analyze menu photo
- `POST /api/process-manual-input` - Analyze manually entered items
- `GET /api/menu-uploads` - Get menu history
- `GET /api/menu-uploads/<id>` - Get specific menu
- `PUT /api/menu-uploads/<id>` - Rename saved menu
- `DELETE /api/menu-uploads/<id>` - Delete saved menu

### Health Check

- `GET /api/health` - API health status

# Contributing

Contributions are welcome! If you'd like to improve Halo, please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

# License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for more details.

# Authors

**Created by:**

- [Kenneth Lin](https://github.com/klin2686)
- [Ronan Nguyen](https://github.com/Ronan-dev869)
- [Isaac Phoon](https://github.com/IsaacPhoon)
- [Ethan Zhao](https://github.com/dolphinalt)

---

<div align="center">
  <p>Built with care for the food allergy community</p>
  <p>If Halo helps you dine safer, consider giving it a star ⭐</p>
</div>
