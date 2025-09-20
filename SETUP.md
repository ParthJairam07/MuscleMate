# 🏋️ Workout Tracker - Setup Guide

A comprehensive workout tracking application built with React, Firebase, and TypeScript.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd WorkoutTracker
npm install
```

### 2. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Create a project"
   - Follow the setup wizard

2. **Enable Firestore Database**
   - In your Firebase project, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location close to your users

3. **Get Firebase Configuration**
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Add app" and select Web (</>)
   - Register your app with a nickname
   - Copy the Firebase configuration object

4. **Create Environment File**
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### 3. Run the Application
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📊 Features

### ✅ What's Working
- **User Management**: Add and manage multiple users
- **Exercise Management**: Add, view, and delete exercises with default exercise library
- **Workout Logging**: Log workouts with weight, reps, and notes
- **Progress Tracking**: Visual charts showing strength progress over time
- **Recent Logs**: View recent workout history in a clean table
- **Statistics**: Personal records, total workouts, and activity tracking
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🎯 Key Components
1. **WorkoutLogger**: Main form for logging workouts
2. **ExerciseManager**: Manage your exercise library
3. **ProgressGraph**: Visual progress tracking with Chart.js
4. **RecentLogsTable**: View workout history
5. **WorkoutStats**: Personal records and statistics

## 🗄️ Database Structure

The app uses Firestore with these collections:

### `users`
```javascript
{
  username: "string" // Document ID
}
```

### `exercises`
```javascript
{
  name: "string",
  day: "string" // Muscle group or day
}
```

### `workoutLogs`
```javascript
{
  username: "string",
  exerciseName: "string",
  weight: number,
  reps: number,
  date: Timestamp,
  notes: "string" // Optional
}
```

## 🎨 Customization

### Adding New Exercise Categories
Edit `src/components/ExerciseManager.tsx` and modify the `DEFAULT_EXERCISES` array:

```javascript
const DEFAULT_EXERCISES = [
  { name: "Your Exercise", day: "Your Category" },
  // ... more exercises
];
```

### Styling
The app uses Tailwind CSS. Modify `src/index.css` or component classes to customize the appearance.

### Chart Configuration
Modify chart options in `src/components/ProgressGraph.tsx` to change the progress calculation or appearance.

## 🚨 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check your `.env` file has correct Firebase configuration
   - Ensure Firestore is enabled in your Firebase project
   - Verify your Firebase project is not paused

2. **No Exercises Showing**
   - Use the Exercise Manager to add default exercises
   - Check if the exercises collection exists in Firestore

3. **Charts Not Loading**
   - Ensure Chart.js dependencies are installed
   - Check browser console for JavaScript errors

4. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check that your Node.js version is compatible

### Development Tips

- Use browser developer tools to debug Firebase queries
- Check the Network tab for failed API calls
- Use Firebase Console to inspect your database
- Enable Firebase Analytics for usage insights

## 📱 Mobile Support

The app is fully responsive and works on:
- Desktop computers
- Tablets (iPad, Android tablets)
- Mobile phones (iOS, Android)

## 🔒 Security Notes

- The app uses Firestore in test mode for development
- For production, set up proper Firestore security rules
- Consider implementing user authentication
- Validate all user inputs on the backend

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Training! 💪**

For support or questions, please open an issue in the repository.
