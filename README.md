<p align="center">
  <img src="https://img.shields.io/badge/🌊-AquaNova-6366f1?style=for-the-badge&labelColor=1e1b4b" alt="AquaNova Logo" />
</p>

<h1 align="center">🌊 AquaNova</h1>

<p align="center">
  <strong>Marine Data Intelligence Platform</strong>
</p>

<p align="center">
  Real-time ocean analytics, biodiversity tracking, and AI-powered marine insights
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-22.x-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/TiDB-Cloud-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="TiDB" />
  <img src="https://img.shields.io/badge/NVIDIA-AI-76B900?style=flat-square&logo=nvidia&logoColor=white" alt="NVIDIA" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 📖 About

**AquaNova** is a comprehensive marine data intelligence platform designed to provide researchers, marine biologists, and ocean enthusiasts with real-time insights into ocean conditions, marine biodiversity, and climate patterns. Built for the **Smart India Hackathon (SIH)**, this platform integrates data from multiple oceanographic sources including **Copernicus Marine Service** and **INCOIS**.

---

## ✨ Features

### 🗺️ Interactive Ocean Maps
- **Real-time ocean current visualization** with animated streamlines
- **Sea surface temperature (SST)** heatmaps with color gradients
- **Multi-layer support** - Toggle between temperature, currents, chlorophyll, and more
- **OpenLayers integration** for smooth map interactions

### 📊 Advanced Analytics Dashboard
- **Live data metrics** from global oceanographic datasets
- **Interactive charts** powered by Chart.js and Recharts
- **Historical trend analysis** with date range filters
- **Export capabilities** for research purposes

### 🐟 Biodiversity Tracking
- **1,247+ marine species** catalogued with detailed information
- **Species distribution maps** based on environmental parameters
- **Conservation status indicators** (IUCN Red List integration)
- **Habitat preference analysis**

### 🤖 AI-Powered Marine Assistant
- **NVIDIA Nemotron** powered chatbot for marine queries
- **Context-aware responses** about ocean conditions
- **Chat history persistence** with localStorage
- **Quick action prompts** for common queries

### 🔐 Secure Authentication
- **JWT-based authentication** system
- **Email OTP verification** for signup
- **Password reset** functionality
- **Session management** with refresh tokens

### 🌡️ Temperature Monitoring
- **Real-time SST data** from satellite observations
- **Anomaly detection** for unusual temperature patterns
- **Regional forecasts** and predictions
- **Alert system** for significant changes

### ⚠️ Alert System
- **Marine heatwave warnings**
- **Cyclone tracking** and alerts
- **Pollution monitoring**
- **Fishing zone advisories**

---

## 🎬 Demo

🔗 **Live Demo:** [https://aquanova-sakthi.vercel.app](https://aquanova-sakthi.vercel.app)

### Screenshots

<table>
  <tr>
    <td align="center"><b>🏠 Dashboard</b></td>
    <td align="center"><b>🗺️ Ocean Map</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/dashboard.png" alt="Dashboard" width="400"/></td>
    <td><img src="docs/screenshots/ocean-map.png" alt="Ocean Map" width="400"/></td>
  </tr>
  <tr>
    <td align="center"><b>🤖 AI Assistant</b></td>
    <td align="center"><b>🔐 Login</b></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/ai-chat.png" alt="AI Chat" width="400"/></td>
    <td><img src="docs/screenshots/login.png" alt="Login" width="400"/></td>
  </tr>
</table>

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ![React](https://img.shields.io/badge/-React%2019-61DAFB?style=flat-square&logo=react&logoColor=black) | UI Framework |
| ![Material UI](https://img.shields.io/badge/-Material%20UI-007FFF?style=flat-square&logo=mui&logoColor=white) | Component Library |
| ![Vanta.js](https://img.shields.io/badge/-Vanta.js-8B5CF6?style=flat-square) | Animated Backgrounds |
| ![Three.js](https://img.shields.io/badge/-Three.js-000000?style=flat-square&logo=three.js&logoColor=white) | 3D Graphics |
| ![Chart.js](https://img.shields.io/badge/-Chart.js-FF6384?style=flat-square&logo=chart.js&logoColor=white) | Data Visualization |
| ![Leaflet](https://img.shields.io/badge/-Leaflet-199900?style=flat-square&logo=leaflet&logoColor=white) | Interactive Maps |
| ![OpenLayers](https://img.shields.io/badge/-OpenLayers-1F6B75?style=flat-square) | Geospatial Mapping |

### Backend
| Technology | Purpose |
|------------|---------|
| ![Node.js](https://img.shields.io/badge/-Node.js%2022-339933?style=flat-square&logo=node.js&logoColor=white) | Runtime Environment |
| ![Express](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white) | API Framework |
| ![TiDB](https://img.shields.io/badge/-TiDB%20Cloud-4479A1?style=flat-square&logo=mysql&logoColor=white) | Database (MySQL Compatible) |
| ![JWT](https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white) | Authentication |

### AI & Data Sources
| Technology | Purpose |
|------------|---------|
| ![NVIDIA](https://img.shields.io/badge/-NVIDIA%20Nemotron-76B900?style=flat-square&logo=nvidia&logoColor=white) | AI Chatbot |
| ![Copernicus](https://img.shields.io/badge/-Copernicus%20Marine-003399?style=flat-square) | Ocean Data Source |
| ![INCOIS](https://img.shields.io/badge/-INCOIS-FF9933?style=flat-square) | Indian Ocean Data |

### Deployment
| Platform | Usage |
|----------|-------|
| ![Vercel](https://img.shields.io/badge/-Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | Frontend Hosting |
| ![Render](https://img.shields.io/badge/-Render-46E3B7?style=flat-square&logo=render&logoColor=white) | Backend API |

---

## 🚀 Installation

### Prerequisites

- **Node.js** v22.x or higher
- **npm** v9.0.0 or higher
- **TiDB Cloud** account (or MySQL 8.0+)
- **NVIDIA API Key** for AI features

### Clone the Repository

```bash
git clone https://github.com/sakthi44710/AquaNova.git
cd AquaNova
```

### Frontend Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_NVIDIA_API_KEY=your_nvidia_api_key

# Start development server
npm start
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file with database credentials
# DB_HOST=your_tidb_host
# DB_PORT=4000
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=aquanova
# JWT_SECRET=your_jwt_secret
# EMAIL_USER=your_email
# EMAIL_PASSWORD=your_email_app_password

# Initialize database
node setup-db.js

# Start server
npm start
```

The API will be available at `http://localhost:5000`

---

## 📁 Project Structure

```
AquaNova/
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 Alerts/          # Alert system components
│   │   ├── 📂 Auth/            # Authentication (ForgotPassword)
│   │   ├── 📂 Biodiversity/    # Species tracking
│   │   ├── 📂 Chatbot/         # AI Assistant
│   │   ├── 📂 Dashboard/       # Main dashboard
│   │   ├── 📂 Datasets/        # Data management
│   │   ├── 📂 Layout/          # App layout wrapper
│   │   ├── 📂 Map/             # Ocean maps
│   │   ├── 📂 Navbar/          # Navigation
│   │   └── 📂 Temperature/     # SST monitoring
│   ├── 📂 contexts/            # React Context providers
│   ├── 📂 pages/               # Page components (Login, Signup)
│   ├── 📂 services/            # API services
│   └── 📂 utils/               # Utility functions
├── 📂 backend/
│   ├── 📂 config/              # Database configuration
│   ├── 📂 middleware/          # Express middleware (auth)
│   ├── 📂 routes/              # API routes
│   ├── 📂 services/            # Business logic
│   └── 📄 server.js            # Entry point
├── 📂 public/                  # Static assets
├── 📂 docs/                    # Documentation
└── 📂 data/                    # Sample datasets
```

---

## 🔌 API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user with OTP |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/send-otp` | Send OTP to email |
| `POST` | `/api/auth/verify-otp` | Verify OTP code |
| `POST` | `/api/auth/reset-password` | Reset password with OTP |
| `GET` | `/api/auth/me` | Get current user (protected) |

### Marine Data Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/datasets` | Get available datasets |
| `GET` | `/api/temperature` | Get SST data |
| `GET` | `/api/biodiversity` | Get species data |
| `GET` | `/api/alerts` | Get active alerts |

### AI Chat Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/nvidia/chat` | Send message to NVIDIA AI |

---

## 🌊 Data Sources

AquaNova integrates data from trusted oceanographic institutions:

| Source | Description |
|--------|-------------|
| 🇪🇺 **[Copernicus Marine Service](https://marine.copernicus.eu/)** | European ocean monitoring - SST, currents, chlorophyll |
| 🇮🇳 **[INCOIS](https://incois.gov.in/)** | Indian National Centre for Ocean Information Services |
| 🇺🇸 **[NOAA](https://www.noaa.gov/)** | National Oceanic and Atmospheric Administration |

---

## 🔧 Environment Variables

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NVIDIA_API_KEY=your_nvidia_api_key
```

### Backend (.env)
```env
# Database
DB_HOST=your_tidb_host
DB_PORT=4000
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=aquanova

# Authentication
JWT_SECRET=your_jwt_secret

# Email (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

### Code Style Guidelines

- ✅ Follow **ESLint** configuration
- ✅ Use **meaningful commit messages**
- ✅ Write **comments** for complex logic
- ✅ Create **tests** for new features
- ✅ Update **documentation** when needed

---

## 📜 Scripts

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### Backend
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (hot reload)
node setup-db.js   # Initialize database tables
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/sakthi44710">
        <img src="https://github.com/sakthi44710.png" width="100px;" alt="Sakthi" style="border-radius: 50%;"/>
        <br />
        <sub><b>Sakthi</b></sub>
      </a>
      <br />
      <sub>🚀 Lead Developer</sub>
    </td>
  </tr>
</table>

---

## 🙏 Acknowledgements

- 🏆 **Smart India Hackathon** for the opportunity
- 🤖 **NVIDIA** for AI API access
- 🌊 **Copernicus Marine Service** for oceanographic data
- 🗄️ **TiDB Cloud** for database hosting
- ▲ **Vercel** for frontend deployment

---

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-💙-6366f1?style=for-the-badge" alt="Made with love" />
  <img src="https://img.shields.io/badge/For%20the-Oceans%20🌊-0ea5e9?style=for-the-badge" alt="For the oceans" />
</p>

<p align="center">
  <a href="https://github.com/sakthi44710/AquaNova/stargazers">
    <img src="https://img.shields.io/github/stars/sakthi44710/AquaNova?style=social" alt="Stars" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/sakthi44710/AquaNova/network/members">
    <img src="https://img.shields.io/github/forks/sakthi44710/AquaNova?style=social" alt="Forks" />
  </a>
  &nbsp;&nbsp;
  <a href="https://github.com/sakthi44710/AquaNova/issues">
    <img src="https://img.shields.io/github/issues/sakthi44710/AquaNova?style=social" alt="Issues" />
  </a>
</p>

---

<p align="center">
  <sub>⭐ Star this repository if you find it helpful!</sub>
</p>
