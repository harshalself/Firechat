# Realtime Chat App

A modern real-time chat application built with **React** for the frontend and **Firebase** for the backend. This project leverages Firebase Authentication and Realtime Database to provide seamless, instant messaging between users.

---

## ✨ Features

- **Real-time Messaging:** Instantly send and receive messages.
- **User Authentication:** Secure sign-up and login using Firebase Auth.
- **Protected Routes:** Only authenticated users can access chat features.
- **Responsive UI:** Works great on desktop and mobile.
- **User Presence:** See who is online (if implemented).

---

## 📸 Screenshots

<!-- Add your screenshots here -->
<!-- Example: -->
<!-- ![Login Page](screenshots/login.png) -->
<!-- ![Chat Window](screenshots/chat.png) -->

---

## 🛠️ Technologies Used

- **Frontend:** React, TypeScript, CSS Modules
- **Backend:** Firebase (Authentication, Realtime Database)

---

## 🚀 Getting Started

Follow these steps to run the project locally:

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Realtime-Chat-App
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**

   - Create a `.env` file in the root directory.
   - Add your Firebase configuration (see your Firebase console).
   - Example:
     ```
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_DATABASE_URL=your_database_url
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

6. **Open the app:**
   - Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to your branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
