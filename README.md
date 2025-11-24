# 🌊 AquaNova - Marine Data Intelligence Platform

![AquaNova](https://img.shields.io/badge/AquaNova-Marine%20Analytics-8B5CF6?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

A comprehensive ocean analytics platform for real-time marine data visualization, species tracking, and AI-powered insights for the Indian Ocean region.

---

## ✨ Features

🌡️ **Ocean Temperature** - Real-time data from Copernicus Marine  
🐟 **Biodiversity** - 1,247+ species with eDNA analysis  
🗺️ **Interactive Maps** - Leaflet-based visualization  
🤖 **AI Assistant** - Google Gemini chatbot  
⚠️ **Alert System** - Heatwaves, cyclones, warnings  
📊 **Data Management** - 156+ active datasets  
🔒 **Secure Auth** - JWT with OTP verification  

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v16 or higher)
- MySQL / TiDB Database
- Git

### 2. Installation

**Frontend**
```bash
# Install frontend dependencies
npm install
```

**Backend**
```bash
# Go to backend folder
cd backend

# Install backend dependencies
npm install
```

### 3. Configuration
Create a `.env` file in the `backend` folder with your credentials:
```env
DB_HOST=your_host
DB_PORT=4000
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=aquanova
EMAIL_USER=your_email
EMAIL_PASSWORD=your_app_password
JWT_SECRET=your_secret_key
```

### 4. Database Setup
Initialize the database tables:
```bash
# From the root directory
node backend/setup-db.js
```

### 5. Running the App

**Start Backend Server**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Start Frontend**
```bash
# Open a new terminal in the root directory
npm start
# App opens at http://localhost:3000
```

## 📦 Deploy to Vercel

```bash
# Prepare for deployment
.\prepare-deploy.ps1

# Push to GitHub
git push origin main

# Deploy on Vercel
# See DEPLOYMENT_GUIDE.md for details
```

**📖 Full Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🔧 Environment Variables

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_AI_KEY=your_key
```

### Backend
```env
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
JWT_SECRET=your_secret
EMAIL_USER=your_email
```

---

## 📊 Tech Stack

**Frontend:** React 19, Material UI, Chart.js, Leaflet  
**Backend:** Node.js, Express, MySQL, JWT  
**AI:** Google Gemini 1.5-flash  
**Deploy:** Vercel, Railway

---

**Built with 💜 for ocean conservation**

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
