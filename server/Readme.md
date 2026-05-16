# 🛠️ E-commerce Backend Setup

This document provides instructions for setting up the backend of the **e-commerce application**.  
The backend is built with **Node.js** and **Express.js**, using **MongoDB** as the database.

---

## 🚀 Getting Started

Follow these steps to get the project running locally on your machine.

### **Prerequisites**
- **Node.js** (LTS version recommended)  
- **npm** (Node Package Manager)  
- A **MongoDB Atlas** account (Free tier is sufficient)  

---

### **1. Clone the Repository**
```bash 
git clone <repository_url>
cd <project_folder>/backend
```
### **2. Install the Dependencies**
```bash
npm install
```
### **3. Configure Environment Variables**
Create a `.env` file in the root directory of the project and add the following variables:
```plaintext
PORT=3000
MONGO_URI="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"
CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
EMAIL_USER="your_brevo_verified_sender_email@example.com"
EMAIL_PASS="xsmtpsib-your_brevo_api_key_here"
```

**Note:** For Brevo Email (uses REST API, not SMTP):
- `EMAIL_USER`: Your verified sender email in Brevo
- `EMAIL_PASS`: Your Brevo API key (from Account Settings > SMTP & API > API Keys)
- Why API? SMTP is blocked on free hosting tiers like Render. REST API works everywhere!
### **4. Start the Server**
```bash
npm start
```
### **5. Access the API**
Open your browser or API client (like Postman) and navigate to:
```
http://localhost:3000/api
```
