# VSAVE Deployment & Operations Guide

### 1. Frontend Deployment (Expo/React Native)

- **Build for Production:** Use EAS (Expo Application Services) to build the app for the target platform.

  ```bash
  eas build --profile production --platform [android|ios]
  ```

- **Deployment Workflow:**
  - **Automated (Recommended):** Set up a GitHub Actions workflow to automatically run `eas build` on every push to your main branch.
  - **Manual:** Download the `.apk` or `.ipa` file from the EAS dashboard and manually upload it to the Google Play Console or Apple App Store Connect.

---

### 2. Backend Deployment (Node.js)

- **Environment Variables:** The following environment variables **must** be set on your hosting server and should never be hard-coded.
  - `DATABASE_URL`: Connection string for your PostgreSQL database.
  - `JWT_SECRET`: Secret key for authentication tokens.
  - `TERMI_API_KEY`: API key for SMS services.
  - `SMILEID_API_KEY`: API key for identity verification.

- **Deployment Steps:**
  1. Install production dependencies: `npm install --production`
  2. Run database migrations: `npx prisma migrate deploy`
  3. Start the application with a process manager like **PM2**: `pm2 start ecosystem.config.js`

---

### 3. Database Management

- **Migrations:** Database schema changes must be applied using a migration tool.
- **Backups:** Establish a regular backup schedule for your production database to prevent data loss.

---

### 4. Operations & Monitoring\*\*

- **Log Aggregation:** Configure your hosting environment to collect application logs centrally.
- **Alerting:** Set up monitoring to alert you of critical events, such as a high volume of failed transactions.
- **Rollback Plan:** Document a clear plan for reverting to a previous version in case of a critical failure.
