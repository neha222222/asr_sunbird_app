# Sunbird ALL - Offline ASR Integration

This project implements offline Automated Speech Recognition (ASR) capabilities for the Sunbird ALL platform, enhancing language learning through interactive exercises and real-time feedback.

## Features

- Offline ASR with ≥ 90% accuracy in multiple languages
- Real-time speech recognition and feedback
- Interactive language learning exercises
- Progress tracking dashboard
- Cross-platform support (Web and Mobile)

## Project Structure

```
.
├── backend/                 # Python backend services
│   ├── app/                # Main application code
│   ├── models/             # ASR models and ML components
│   ├── tests/              # Backend tests
│   └── Dockerfile          # Backend container configuration
├── frontend/               # React/React Native frontend
│   ├── web/               # React web application
│   ├── mobile/            # React Native mobile app
│   └── shared/            # Shared components and utilities
└── docker-compose.yml     # Container orchestration
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- Docker and Docker Compose
- React Native development environment (for mobile)

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/web  # or frontend/mobile for mobile app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

1. Start the backend services:
   ```bash
   docker-compose up -d
   ```

2. Start the frontend development server:
   ```bash
   # For web
   cd frontend/web
   npm start

   # For mobile
   cd frontend/mobile
   npm run android  # or npm run ios
   ```

## Technology Stack

- Backend:
  - Python 3.8+
  - FastAPI
  - Vosk (Offline ASR Engine)
  - SQLAlchemy
  - Docker

- Frontend:
  - React (Web)
  - React Native (Mobile)
  - TypeScript
  - Material-UI
  - Redux Toolkit

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 