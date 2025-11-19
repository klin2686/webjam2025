# Backend API Documentation

## Overview

This is a Flask-based REST API for a food allergy management application. The API provides endpoints for user authentication, allergy management, and menu processing using Google's Gemini AI.

## Base URL

```
http://localhost:5001/api
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the access token in the request headers:

```
Authorization: Bearer <access_token>
```

### Token Types

- **Access Token**: Short-lived token for API requests (included in Authorization header)
- **Refresh Token**: Long-lived token for obtaining new access tokens

---

## Endpoints

### Health Check

#### GET /health

Check API health status.

**Authentication**: None

**Response**:
```json
{
  "status": "healthy"
}
```

---

## Authentication Endpoints

### POST /auth/register

Register a new user with email and password.

**Authentication**: None

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe" // optional
}
```

**Response** (201):
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "email_verified": false,
    "profile_picture": null,
    "created_at": "2024-01-01T00:00:00",
    "has_password": true,
    "has_google_auth": false
  },
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

**Errors**:
- 400: Missing email/password, invalid email format, weak password
- 409: Email already registered

---

### POST /auth/login

Login with email and password.

**Authentication**: None

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200):
```json
{
  "message": "Login successful",
  "user": { /* User object */ },
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

**Errors**:
- 400: Missing email/password
- 401: Invalid credentials

---

### POST /auth/google

Authenticate or register using Google OAuth.

**Authentication**: None

**Request Body**:
```json
{
  "token": "google_oauth_token"
}
```

**Response** (200 or 201):
```json
{
  "message": "Login successful", // or "User registered successfully"
  "user": { /* User object */ },
  "access_token": "eyJ...",
  "refresh_token": "eyJ..."
}
```

**Behavior**:
- If user exists with Google ID: Login and update profile
- If user exists with email but no Google ID: Link Google account
- If new user: Register with Google

**Errors**:
- 400: Missing token
- 401: Invalid Google token

---

### POST /auth/refresh

Refresh access token using refresh token.

**Authentication**: None (requires refresh token in body)

**Request Body**:
```json
{
  "refresh_token": "eyJ..."
}
```

**Response** (200):
```json
{
  "access_token": "eyJ..."
}
```

**Errors**:
- 400: Missing refresh token
- 401: Invalid refresh token

---

### GET /auth/me

Get current user information.

**Authentication**: Required

**Response** (200):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "email_verified": true,
    "profile_picture": "https://example.com/pic.jpg",
    "created_at": "2024-01-01T00:00:00",
    "has_password": true,
    "has_google_auth": true
  }
}
```

---

### PUT /auth/update-profile

Update user profile information.

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Jane Doe", // optional
  "profile_picture": "https://example.com/new-pic.jpg" // optional
}
```

**Response** (200):
```json
{
  "message": "Profile updated successfully",
  "user": { /* Updated user object */ }
}
```

**Errors**:
- 400: No data provided

---

### POST /auth/change-password

Change user password.

**Authentication**: Required

**Request Body**:
```json
{
  "current_password": "OldPassword123!",
  "new_password": "NewPassword123!"
}
```

**Response** (200):
```json
{
  "message": "Password changed successfully"
}
```

**Errors**:
- 400: Missing passwords, weak new password, OAuth-only account
- 401: Incorrect current password

---

## Allergy Management Endpoints

### GET /allergy/get

Retrieve all allergies for the current user (ordered by severity, descending).

**Authentication**: Required

**Response** (200):
```json
{
  "message": "Allergies retrieved successfully",
  "user_allergy": [
    {
      "id": 1,
      "user_id": 1,
      "allergen_id": 2,
      "severity": 3,
      "allergen_name": "Peanuts"
    },
    {
      "id": 2,
      "user_id": 1,
      "allergen_id": 5,
      "severity": 2,
      "allergen_name": "Milk"
    }
  ]
}
```

---

### POST /allergy/add

Add a new allergy for the current user.

**Authentication**: Required

**Request Body**:
```json
{
  "allergen_name": "Peanuts",
  "severity": 3
}
```

**Valid Allergen Names** (case-insensitive):
- Milk
- Eggs
- Fish
- Shellfish
- Tree Nuts
- Peanuts
- Wheat
- Soybeans
- Sesame

**Severity Levels**:
- 1: Mild
- 2: Moderate
- 3: Severe

**Response** (201):
```json
{
  "message": "Allergy created successfully",
  "user_allergy": {
    "id": 3,
    "user_id": 1,
    "allergen_id": 2,
    "severity": 3,
    "allergen_name": "Peanuts"
  }
}
```

**Errors**:
- 400: Missing/invalid allergen_name, missing/invalid severity, allergy already exists
- 404: Allergen not found in database

---

### PUT /allergy/update

Update the severity of an existing allergy.

**Authentication**: Required

**Request Body**:
```json
{
  "user_allergy_id": 1,
  "severity": 2
}
```

**Response** (200):
```json
{
  "message": "User allergy severity updated successfully",
  "user_allergy": {
    "id": 1,
    "user_id": 1,
    "allergen_id": 2,
    "severity": 2,
    "allergen_name": "Peanuts"
  }
}
```

**Errors**:
- 400: Missing/invalid user_allergy_id, missing/invalid severity, allergy not found
- 401: User doesn't own this allergy

---

### DELETE /allergy/delete

Delete an allergy for the current user.

**Authentication**: Required

**Request Body**:
```json
{
  "user_allergy_id": 1
}
```

**Response** (200):
```json
{
  "message": "Ok"
}
```

**Errors**:
- 400: Missing/invalid user_allergy_id
- 401: User doesn't own this allergy
- 404: Allergy not found

---

## Menu Processing Endpoints (LLM)

### POST /process-menu

Process a menu image and extract items with allergen information using Google Gemini AI.

**Authentication**: Required

**Request**: Multipart form data
```
menu_image: <image file>
```

**Supported Image Formats**:
- .jpg, .jpeg
- .png
- .heic, .heif
- .webp

**Response** (200):
```json
[
  {
    "item_name": "Grilled Salmon",
    "common_allergens": ["Fish"],
    "confidence_score": 10
  },
  {
    "item_name": "Caesar Salad",
    "common_allergens": ["Eggs", "Fish", "Milk"],
    "confidence_score": 8
  },
  {
    "item_name": "Fruit Plate",
    "common_allergens": ["None"],
    "confidence_score": 10
  }
]
```

**Notes**:
- Images are preprocessed (resized, enhanced) before processing
- Confidence score ranges from 1-10
- "None" indicates no allergens present
- "Unknown" indicates uncertainty

**Errors**:
- 400: No file uploaded, unsupported file type, unreadable menu image
- 500: Image processing failed, no response from AI

---

### POST /process-manual-input

Process manually entered menu items and identify allergens using Google Gemini AI.

**Authentication**: Required

**Request Body**:
```json
{
  "menu_items": [
    "Grilled Salmon",
    "Caesar Salad",
    "Chicken Alfredo",
    "Fruit Smoothie"
  ],
  "menu_name": "Dinner Menu" // optional, defaults to "Untitled Manual Menu Input"
}
```

**Response** (200):
```json
[
  {
    "item_name": "Grilled Salmon",
    "common_allergens": ["Fish"],
    "confidence_score": 10
  },
  {
    "item_name": "Caesar Salad",
    "common_allergens": ["Eggs", "Fish", "Milk"],
    "confidence_score": 8
  },
  {
    "item_name": "Chicken Alfredo",
    "common_allergens": ["Milk", "Wheat"],
    "confidence_score": 9
  },
  {
    "item_name": "Fruit Smoothie",
    "common_allergens": ["Unknown"],
    "confidence_score": 5
  }
]
```

**Errors**:
- 400: No json body, missing menu_items field, invalid menu items, non-food items

---

### GET /menu-uploads

Get all menu uploads for the authenticated user.

**Authentication**: Required

**Query Parameters**:
- `limit` (optional): Integer to limit the number of results returned

**Response** (200):
```json
[
  {
    "id": 1,
    "user_id": 1,
    "upload_name": "Dinner Menu",
    "analysis_result": [
      {
        "item_name": "Grilled Salmon",
        "common_allergens": ["Fish"],
        "confidence_score": 10
      }
    ],
    "created_at": "2024-01-01T00:00:00"
  },
  {
    "id": 2,
    "user_id": 1,
    "upload_name": "Lunch Menu",
    "analysis_result": [
      {
        "item_name": "Caesar Salad",
        "common_allergens": ["Eggs", "Fish", "Milk"],
        "confidence_score": 8
      }
    ],
    "created_at": "2024-01-01T12:00:00"
  }
]
```

**Errors**:
- 500: Failed to retrieve menu uploads

---

### GET /menu-uploads/{upload_id}

Get a specific menu upload by ID.

**Authentication**: Required

**URL Parameters**:
- `upload_id`: Integer ID of the menu upload

**Response** (200):
```json
{
  "id": 1,
  "user_id": 1,
  "upload_name": "Dinner Menu",
  "analysis_result": [
    {
      "item_name": "Grilled Salmon",
      "common_allergens": ["Fish"],
      "confidence_score": 10
    }
  ],
  "created_at": "2024-01-01T00:00:00"
}
```

**Errors**:
- 404: Menu upload not found
- 500: Failed to retrieve menu upload

---

### PUT /menu-uploads/{upload_id}

Rename a menu upload.

**Authentication**: Required

**URL Parameters**:
- `upload_id`: Integer ID of the menu upload

**Request Body**:
```json
{
  "upload_name": "New Menu Name"
}
```

**Response** (200):
```json
{
  "id": 1,
  "user_id": 1,
  "upload_name": "New Menu Name",
  "analysis_result": [
    {
      "item_name": "Grilled Salmon",
      "common_allergens": ["Fish"],
      "confidence_score": 10
    }
  ],
  "created_at": "2024-01-01T00:00:00"
}
```

**Errors**:
- 400: upload_name is required or empty
- 404: Menu upload not found
- 500: Failed to rename menu upload

---

### DELETE /menu-uploads/{upload_id}

Delete a menu upload.

**Authentication**: Required

**URL Parameters**:
- `upload_id`: Integer ID of the menu upload

**Response** (200):
```json
{
  "message": "Menu upload deleted successfully"
}
```

**Errors**:
- 404: Menu upload not found
- 500: Failed to delete menu upload

---

## Data Models

### User Object

```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "email_verified": true,
  "profile_picture": "https://example.com/pic.jpg",
  "created_at": "2024-01-01T00:00:00",
  "has_password": true,
  "has_google_auth": true
}
```

### UserAllergy Object

```json
{
  "id": 1,
  "user_id": 1,
  "allergen_id": 2,
  "severity": 3,
  "allergen_name": "Peanuts"
}
```

### Menu Item Object (AI Response)

```json
{
  "item_name": "Grilled Salmon",
  "common_allergens": ["Fish"],
  "confidence_score": 10
}
```

### MenuUpload Object

```json
{
  "id": 1,
  "user_id": 1,
  "upload_name": "Dinner Menu",
  "analysis_result": [
    {
      "item_name": "Grilled Salmon",
      "common_allergens": ["Fish"],
      "confidence_score": 10
    }
  ],
  "created_at": "2024-01-01T00:00:00"
}
```

---

## Error Response Format

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

Common HTTP status codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (authentication required or failed)
- 404: Not Found
- 409: Conflict (resource already exists)
- 500: Internal Server Error

---

## Standard Allergens

The API recognizes these standard allergens (case-insensitive):
- Milk
- Eggs
- Fish
- Shellfish
- Tree Nuts
- Peanuts
- Wheat
- Soybeans
- Sesame
