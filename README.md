# Job Board Application

A full-stack application for job postings and applications with separate portals for companies and students.

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE_ID=your_emailjs_service_id
   EMAIL_TEMPLATE_ID=your_emailjs_template_id
   EMAIL_PUBLIC_KEY=your_emailjs_public_key
   EMAIL_PRIVATE_KEY=your_emailjs_private_key
   CONTACT_EMAIL=your_contact_email
   ```

4. Database Setup:

   - For local development, use `db_local.js` instead of `db.js` in the db folder
   - Modify the MongoDB connection string in `db_local.js` if needed

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with:

   ```env
   VITE_BACKEND_URL=http://localhost:4000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

⚠️ **Important**: Many endpoints in this API are protected by authentication middleware. To access these endpoints, you must include a valid JWT token in the request headers. The token can be obtained after successful login/registration.

Example of protected request:

```bash
curl -H "Authorization: Bearer your_jwt_token" http://localhost:4000/api/endpoint
```

### Student APIs

#### 1. Register Student

- **Endpoint**: POST `/student/register`
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "fullname": "John Doe",
    "password": "password123"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Error Responses**:
  - 400: Invalid input / User already exists
  - 500: Server error

#### 2. Student Login

- **Endpoint**: POST `/student/login`
- **Request Body**:
  ```json
  {
    "email": "student@example.com",
    "password": "password123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "user": {
      "fullname": "John Doe",
      "email": "student@example.com"
    },
    "token": "jwt_token_here"
  }
  ```
- **Error Responses**:
  - 401: Invalid credentials
  - 500: Server error

#### 3. Apply to Job

- **Endpoint**: POST `/student/apply-job/:jobId`
- **Headers**: `Authorization: Bearer token`
- **Success Response** (200):
  ```json
  {
    "message": "Successfully applied to job"
  }
  ```
- **Error Responses**:
  - 400: Already applied / Invalid job ID
  - 404: Job not found
  - 401: Unauthorized
  - 500: Server error

### Company APIs

#### 1. Register Company

- **Endpoint**: POST `/company/register`
- **Request Body**:
  ```json
  {
    "email": "company@example.com",
    "companyname": "Tech Corp",
    "password": "password123",
    "mobile": "+1234567890"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Error Responses**:
  - 400: Invalid input / Company already exists
  - 500: Server error

#### 2. Create Job

- **Endpoint**: POST `/company/jobs`
- **Headers**: `Authorization: Bearer token`
- **Request Body**:
  ```json
  {
    "title": "Software Engineer",
    "description": "Job description here",
    "experienceLevel": "BEGINNER",
    "endDate": "2024-12-31",
    "emails": ["notify@example.com"]
  }
  ```
- **Success Response** (201):
  ```json
  {
    "job": {
      "title": "Software Engineer",
      "description": "Job description here",
      "experienceLevel": "BEGINNER",
      "endDate": "2024-12-31",
      "candidates": []
    }
  }
  ```
- **Error Responses**:
  - 400: Invalid input
  - 401: Unauthorized / Company not verified
  - 500: Server error

#### 3. Get Company Jobs

- **Endpoint**: GET `/company/jobs`
- **Headers**: `Authorization: Bearer token`
- **Success Response** (200):
  ```json
  {
    "jobs": [
      {
        "title": "Software Engineer",
        "description": "Job description",
        "candidates": ["applicant@example.com"]
      }
    ]
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 500: Server error

#### 4. Send Verification OTP

- **Endpoint**: POST `/company/send-verification`
- **Headers**: `Authorization: Bearer token`
- **Success Response** (200):
  ```json
  {
    "message": "OTP sent successfully"
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 500: Email sending failed

#### 5. Verify OTP

- **Endpoint**: POST `/company/verify-otp`
- **Headers**: `Authorization: Bearer token`
- **Request Body**:
  ```json
  {
    "otp": "123456"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "company": {
      "verified": true,
      "name": "Tech Corp"
    }
  }
  ```
- **Error Responses**:
  - 400: Invalid OTP / OTP expired
  - 401: Unauthorized
  - 500: Server error

## Common Status Codes

- **200**: Success
- **201**: Successfully created
- **400**: Bad request / Invalid input
- **401**: Unauthorized / Invalid token
- **403**: Forbidden
- **404**: Resource not found
- **409**: Conflict (e.g., duplicate entry)
- **500**: Internal server error

## Authorization

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```
