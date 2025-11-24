# Halo Backend

Flask-based RESTful API for the Halo food allergy management application.

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Setup and Running

1. **Change into the backend directory**

   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**

   On Windows:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

   On macOS/Linux:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**

   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: On Windows, use `copy` instead of `cp`*

   Update the values in `.env`:
   - `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
   - `GEMINI_API_KEY` - Your Google Gemini API key

5. **Seed the database**

   Populate the database with initial allergen data (the FDA's 9 major food allergens).

   On Windows:
   ```bash
   python seed_db.py
   ```

   On macOS/Linux:
   ```bash
   python3 seed_db.py
   ```

   *Note: You only need to do this on the first run or after resetting your database*

6. **Run the application**

   On Windows:
   ```bash
   python run.py
   ```

   On macOS/Linux:
   ```bash
   python3 run.py
   ```

   The API will be available at `http://localhost:5001`

## Files and Structure

- **`app/`** -  Main application package
  - **`app/__init__.py`** - App factory and blueprint registration
  - **`app/config.py`** - Configuration object and environment settings
  - **`app/extensions.py`** - Third-party extensions (DB, migrations, etc.)
  - **`app/models/`** - SQLAlchemy models (`user.py`, `user_allergy.py`, `allergen.py`, `menu_upload.py`)
  - **`app/routes/`** - Blueprint routes (`auth_routes.py`, `allergy_routes.py`, `llm_routes.py`, `health_routes.py`)
  - **`app/utils/`** - Helper modules (`google_oauth.py`, `jwt_utils.py`, `validators.py`)
- **`requirements.txt`** - Python dependencies
- **`run.py`** - App entrypoint — starts the Flask application
- **`seed_db.py`** - Simple script for populating the database with initial data

## Key Architectural Details
- **Framework & pattern:** Flask application using blueprints for routes and an application factory pattern.
- **Auth:** JWT-based authentication (access + refresh tokens). Protect API routes with `Authorization: Bearer <token>` header.
- **AI integration:** Menu processing endpoints use Google Gemini to analyze images and text.
- **Separation of concerns:** Routes focus on request/response handling; models encapsulate DB structure; utilities handle external integrations and token management.

## Notes

If you need more details about specific endpoints, see [API_REFERENCE.md](API_REFERENCE.md) in this directory.
