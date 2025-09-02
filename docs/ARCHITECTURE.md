# VSAVE System Architecture & Technical Specifications

**Version: 1.0**

### 1. Introduction & Objectives

This document serves as the core technical blueprint for the VSAVE platform. Its purpose is to provide a comprehensive overview of the system's architecture, core components, data flows, and security protocols. It is intended for all members of the development team, including new joiners, to ensure a shared understanding of the platform's design and functionality.

***

### 2. Component Breakdown

The VSAVE platform is built on a service-oriented architecture, consisting of three primary components that interact to deliver seamless functionality.

* **Frontend (VSAVE-Frontend)**
  * **Technology:** React Native with Expo.
  * **Role:** The cross-platform user interface for agents and administrators. It handles all user interactions and communicates with the backend via a secure API.
* **Backend (VSAVE-Backend)**
  * **Technology:** Node.js.
  * **Role:** The central nervous system of the platform. It contains the business logic, manages all financial transactions, user data, and orchestrates integrations with external services.
* **Database**
  * **Technology:** PostgreSQL.
  * **Role:** The persistent data store for all critical information, including user profiles, wallet balances, transaction history, and system logs.

### 3. Data Flow & System Logic

This section details the flow of data for key user actions.

* **Manual Cash Deposit Process**
    1. A Marketer initiates a manual deposit request via the frontend.
    2. The frontend sends the request to the backend API.
    3. The backend records the amount in the user's `pending_cash_balance`.
    4. An administrator reviews the transaction and an uploaded "proof photo" via the Admin Console.
    5. Upon approval, the backend transfers the amount from `pending_cash_balance` to the user's `main_balance`. A final `transaction` record is created.

* **Automated Savings Plan**
    1. A scheduled job runs at a predefined frequency (e.g., daily).
    2. The job attempts to debit the user's wallet for the pre-agreed savings amount.
    3. For the **first successful debit** of a new savings "circle," the system executes a profit-sharing logic:
        * **50%** of the savings amount is allocated to the Admin.
        * **50%** is allocated to the user's savings.
    4. For all subsequent debits within the same circle, **100%** of the savings amount is allocated to the user.
    5. All money movements are recorded as `journal_entries` for an auditable trail.

***

### 4. External Service Integrations

The VSAVE platform integrates with several third-party services to deliver its core functionality.

* **Banking Partners:**
  * Wema Bank (ALAT), Sterling Bank (PaywithSpecta), GTBank (Squad).
  * **Purpose:** To manage financial transactions and virtual accounts.
* **Identity Verification (KYC):**
  * SmileID.
  * **Purpose:** To perform identity verification (e.g., BVN, face match) during user registration to prevent fraud.
* **Communication:**
  * Termii & SmartSMS.
  * **Purpose:** To send automated notifications, such as OTPs and transaction alerts.

***

### 5. Security, Auditing & Compliance

The platform's security is a top priority, with several measures in place to ensure data integrity and user protection.

* **Role-Based Access Control (RBAC):** Access to sensitive features is restricted based on user roles (`Admin`, `Region Admin`, `Marketer`).
* **Multi-Factor Authentication (MFA):** Enforced for all users with approval permissions (e.g., Admins) to secure critical operations.
* **Auditing:** An `audit_logs` table records every sensitive action, capturing the user, action, and any data changes.
* **Monitoring & Anomaly Detection:** The system includes triggers to monitor for critical events, such as a high `pending_cash_balance`, and a documented playbook for responding to these alerts.

***

### 6. Technology Stack

* **Project Language:** TypeScript
* **Frontend:** React Native, Expo, React Navigation, Expo Router
* **Backend:** Node.js (with an API framework like Express.js or NestJS)
* **Database:** PostgreSQL
* **API Standard:** RESTful API using JSON
* **CI/CD:** GitHub Actions with EAS Build
