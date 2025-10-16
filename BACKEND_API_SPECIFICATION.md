# Vsave Backend API Specification

This document provides a comprehensive list of all exposed RESTful API endpoints for the Vsave Backend. This specification is the single source of truth for frontend developers and other API consumers.

**Base URL:** `https://[Your-Server-Host]/api/v1`

---

## Table of Contents

1. General Information
2. Authentication
3. Standard Response Formats
4. User & Authentication Endpoints (`/user`)
5. KYC Endpoints (`/user/kyc`)
6. Banking & Payments Endpoints
7. Vending Services Endpoints (`/vending`)

---

## 1. General Information

- **Protocol:** All API communication must be over **HTTPS**.
- **Data Format:** All request and response bodies must be in **JSON** format.
- **Content-Type:** The `Content-Type: application/json` header is required for all `POST`, `PUT`, and `PATCH` requests.
- **Password Hashing:** Passwords are never returned in responses. They are securely hashed using **Argon2**.

---

## 2. Authentication

Most endpoints are protected and require a JSON Web Token (JWT). The token must be sent in the `Authorization` header using the Bearer scheme.

```json
{
    "Authorization": "Bearer <your_jwt_token>"
}
```

---

## 3. Standard Response Formats

### Success Response

Successful requests return a `2xx` status code with a `status` of `"success"`.

```json
{
    "status": "success",
    "message": "Operation completed successfully.",
    "data": { "key": "value" }
}
```

### Error Response

Failed requests return a `4xx` or `5xx` status code with a `status` of `"error"`. For validation errors, an `errors` array may be included.

**Example (404 Not Found):**

```json
{
    "status": "error",
    "message": "Resource not found."
}
```

**Example (400 Validation Error):**

```json
{
    "status": "error",
    "message": "Validation failed.",
    "errors": [
        { "field": "email", "message": "Email is already in use." }
    ]
}
```

---

## 4. User & Authentication Endpoints (`/user`)

### `POST /user/register`

- **Description:** Registers a new user account.
- **Access:** Public

**Request Body:**

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "a_strong_password",
    "gender": "Male",
    "dateOfBirth": "1990-05-15",
    "phoneNumber": "08012345678"
}
```

**Success Response (201 Created):**

```json
{
    "status": "success",
    "message": "User created successfully. Please check your email to verify your account.",
    "data": {
        "userId": "60c72b2f9b1d8c001f8e4d2a"
    }
}
```

### `POST /user/login`

- **Description:** Authenticates a user and returns a JWT.
- **Access:** Public

**Request Body:**

```json
{
    "email": "john.doe@example.com",
    "password": "a_strong_password"
}
```

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "Login successful.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### `POST /user/verify-email`

- **Description:** Verifies a user's email with a token.
- **Access:** Public

**Request Body:**

```json
{
    "email": "john.doe@example.com",
    "token": "123456"
}
```

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "Email verified successfully."
}
```

### `POST /user/resend-verification-token`

- **Description:** Requests a new email verification token.
- **Access:** Public

**Request Body:**

```json
{
    "email": "john.doe@example.com"
}
```

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "A new verification token has been sent to your email."
}
```

### `GET /user/profile`

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "Profile retrieved successfully.",
    "data": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "gender": "Male",
        "dateOfBirth": "1990-05-15T00:00:00.000Z",
        "phoneNumber": "08012345678",
        "virtualAccountNumber": "9006809223",
        "isVerified": true
    }
}
```

## 5. KYC Endpoints (`/user/kyc`)

### `POST /user/kyc/stage1`

**Request Body:**

```json
{
    "profession": "Software Engineer",
    "accountNumber": "0123456789",
    "bank": "044",
    "country": "Nigeria",
    "state": "Lagos",
    "bvn": "22223333444",
    "address": "123 Techie Lane, Ikeja"
}
```

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "KYC Stage 1 information submitted successfully.",
    "data": {
        "kycStatus": "pending",
        "kycStage": 1
    }
}
```

---

## 6. Banking & Payments Endpoints

### `GET /banks`

- **Description:** Retrieves a list of all available banks and their codes (from Flutterwave).
- **Access:** Auth Required (User)

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "Banks retrieved successfully.",
    "data": [
        {
            "id": 132,
            "code": "044",
            "name": "Access Bank"
        },
        {
            "id": 133,
            "code": "063",
            "name": "Access Bank (Diamond)"
        }
    ]
}
```

### `POST /accounts/resolve`

- **Description:** Verifies bank account details.
- **Access:** Auth Required (User)

**Request Body:**

```json
{
    "accountNumber": "0123456789",
    "bankCode": "044"
}
```

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "Account details resolved successfully.",
    "data": {
        "account_number": "0123456789",
        "account_name": "JOHN DOE"
    }
}
```

### `POST /account/virtual`

- **Description:** Creates a virtual bank account for the authenticated user (via SquadCo).
- **Access:** Auth Required (User)

**Request Body:**

```json
{
    "bvn": "22223333444",
    "address": "123 Techie Lane, Ikeja"
}
```

**Success Response (201 Created):**

```json
{
    "status": "success",
    "message": "Virtual account created successfully.",
    "data": {
        "bank_name": "VFD Microfinance Bank",
        "virtual_account_number": "9006809223",
        "customer_identifier": "60c72b2f9b1d8c001f8e4d2a"
    }
}
```

---

## 7. Vending Services Endpoints (`/vending`)

### `POST /vending/airtime`

- **Description:** Purchases airtime for a specified phone number.
- **Access:** Auth Required (User)

**Request Body:**

```json
{
    "phoneNumber": "08012345678",
    "amount": 500
}
```

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "Airtime purchase successful.",
    "data": {
        "transaction_reference": "SAB-168..."
    }
}
```

### `GET /vending/data-plans/:network`

- **Description:** Retrieves available data plans for a specified network.
- **Access:** Auth Required (User)
- **URL Params:** `network` (e.g., `MTN`, `GLO`, `AIRTEL`)

**Example URL:** `/api/v1/vending/data-plans/MTN`

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "Data plans retrieved successfully.",
    "data": [
        {
            "plan_code": "MTN_50MB_DAILY",
            "price": "50.00",
            "allowance": "50MB",
            "validity": "1 Day"
        }
    ]
}
```

### `POST /vending/data`

- **Description:** Purchases a data plan for a specified phone number.
- **Access:** Auth Required (User)

**Request Body:**

```json
{
    "phoneNumber": "08012345678",
    "amount": "50.00",
    "planCode": "MTN_50MB_DAILY"
}
```

**Success Response (200 OK):**

```json
{
    "status": "success",
    "message": "Data purchase successful.",
    "data": {
        "transaction_reference": "SDB-168..."
    }
}
```
