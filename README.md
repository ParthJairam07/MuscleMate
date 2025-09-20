# 💪 Workout Tracker

A beautiful, modern workout tracking application built with React, Firebase, and Tailwind CSS. Track your fitness journey with stunning visualizations and comprehensive analytics.

![Workout Tracker](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-9.0.0-orange?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.0-blue?style=for-the-badge&logo=typescript)

## ✨ Features

- 🏋️ **Log Workouts**: Track weight, reps, and exercises with beautiful forms
- 📊 **Progress Visualization**: Interactive charts showing your strength progress over time
- 📈 **Statistics Dashboard**: Comprehensive analytics including personal records and workout volume
- 👥 **Multi-User Support**: Track workouts for multiple users
- 🎯 **Exercise Management**: Add, edit, and manage your exercise library
- 📱 **Responsive Design**: Beautiful on all devices with glassmorphism UI
- 🔥 **Real-time Data**: Powered by Firebase for instant updates

## 🚀 Live Demo

[View Live Demo](https://your-demo-link.com) *(Add your deployed link here)*

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore
- **Charts**: Chart.js with react-chartjs-2
- **Build Tool**: Vite
- **Styling**: Glassmorphism design with custom animations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/workout-tracker.git
   cd workout-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Copy your Firebase config to `.env` file:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎨 UI Features

- **Glassmorphism Design**: Modern frosted glass effects throughout
- **Smooth Animations**: Hover effects and transitions for better UX
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Easy on the eyes with beautiful gradients
- **Interactive Charts**: Real-time progress visualization

## 📱 Screenshots

### Main Dashboard
![Dashboard](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Workout+Tracker+Dashboard)

### Progress Charts
![Charts](https://via.placeholder.com/800x400/16213e/ffffff?text=Progress+Visualization)

### Statistics
![Stats](https://via.placeholder.com/800x400/0f3460/ffffff?text=Workout+Statistics)

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Firebase Collections

The app uses three main Firestore collections:

- **users**: Stores user information
- **exercises**: Exercise library with muscle groups
- **workoutLogs**: Individual workout entries

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing framework
- [Firebase](https://firebase.google.com/) for the backend services
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Chart.js](https://www.chartjs.org/) for beautiful charts
- [Vite](https://vitejs.dev/) for the fast build tool

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Contact me at [your-email@example.com]

---

⭐ **Star this repository if you found it helpful!**
