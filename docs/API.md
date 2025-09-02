# VSAVE Backend API Documentation

### 1. Introduction & General Concepts

* **API Name:** VSAVE Backend API
* **Base URL:** `https://api.vsave.com/v1`
* **Purpose:** To provide a RESTful interface for managing users, wallets, savings plans, and administrative tasks for the VSAVE platform.
* **Authentication:** All API requests must include a valid JSON Web Token (JWT) in the `Authorization` header, like so: `Authorization: Bearer [your_jwt_token]`.
* **Data Format:** All requests and responses use **JSON**.
* **HTTP Status Codes:** The API uses standard HTTP status codes to indicate the success or failure of a request.
* **Error Responses:** All error responses will follow a consistent JSON format:

        ```json
        {
        "success": false,
        "message": "A clear, human-readable error message.",
        "code": 400
        }
        ```

***

### 2. API Endpoints

#### **`Users`**

* **`POST /users/register`**
  * **Description:** Creates a new user account.
  * **Authentication:** None.
  * **Request Body:**

        ```json
        {
          "full_name": "string",
          "email": "string",
          "phone_number": "string",
          "password": "string",
          "referral_code": "string"
        }
        ```

  * **Successful Response (`201 Created`):**

        ```json
        {
          "success": true,
          "message": "User registered successfully."
        }
        ```

* **`GET /users/me`**
  * **Description:** Retrieves the profile of the currently authenticated user.
  * **Authentication:** Required.
  * **Successful Response (`200 OK`):**

        ```json
        {
          "success": true,
          "data": {
            "id": "string",
            "full_name": "string",
            "email": "string",
            "phone_number": "string",
            "wallet_balance": "number"
          }
        }
        ```

#### **`Wallets`**

* **`POST /wallets/deposit/manual`**
  * **Description:** Initiates a manual cash deposit to a user's wallet. This endpoint is restricted to **Marketer** and **Admin** roles.
  * **Authentication:** Required.
  * **Request Body:**

        ```json
        {
          "user_id": "string",
          "amount_kobo": "number",
          "proof_photo_url": "string"
        }
        ```

  * **Successful Response (`200 OK`):**

        ```json
        {
          "success": true,
          "message": "Manual deposit request submitted for approval."
        }
        ```

#### **`Savings`**

* **`POST /savings/plan/start`**
  * **Description:** Creates a new automated savings plan for a user.
  * **Authentication:** Required.
  * **Request Body:**

        ```json
        {
          "goal_name": "string",
          "target_amount_kobo": "number",
          "frequency": "daily" | "weekly" | "monthly",
          "amount_per_interval_kobo": "number"
        }
        ```

  * **Successful Response (`201 Created`):**

        ```json
        {
          "success": true,
          "data": {
            "id": "string",
            "message": "Savings plan created successfully."
          }
        }
        ```
