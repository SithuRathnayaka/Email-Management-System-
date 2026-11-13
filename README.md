# CDCE Email Management System

A responsive React frontend prototype for the Centre for Distance and Continuing Education, University of Peradeniya. The application uses local mock data and browser state only; it does not connect to authentication, a database, or an email server.

## Run locally

1. Install Node.js (LTS) and open this folder in Visual Studio Code.
2. Open **Terminal → New Terminal**.
3. Install dependencies:

   ```sh
   npm install
   ```

4. Start the development server:

   ```sh
   npm start
   ```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Demo sign-in

Enter any non-empty username and password. Use `admin` as the username to display the Director role. Demo sign-in is not real authentication, and the Remember Me checkbox does not persist credentials.

## Included frontend features

- Responsive dashboard, sidebar navigation, activity charts, and announcements.
- Recipient and category management with local CRUD, CSV import, filtering, and export.
- Email composer with recipient selection, rich-text controls, templates, preview, attachments, drafts, simulated send confirmation, and scheduling.
- Email history, scheduled-email management, templates, user and role management, reports, and settings.
- An Axios client stub in `src/services/apiClient.js` for future API integration; no requests are made by this prototype.

Email send and schedule actions only update local demo state. No message is sent. Settings, users, roles, and recipient changes are not persisted to a backend.

## Build

```sh
npm run build
```
