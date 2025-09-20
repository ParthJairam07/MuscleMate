import React from "react";
import WorkoutLogger from "./components/WorkoutLogger";
import ProgressGraph from "./components/ProgressGraph";
import RecentLogsTable from "./components/RecentLogsTable";
import ExerciseManager from "./components/ExerciseManager";
import WorkoutStats from "./components/WorkoutStats";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center p-6">
        <div className="text-center mb-12 mt-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl">
            <span className="text-5xl">🏋🏽</span>
          </div>
          <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight">
            MuscleMate
          </h1>
          <p className="text-xl text-purple-200 font-medium max-w-2xl mx-auto leading-relaxed">
            Tranforming into a Gym Rat
          </p>
        </div>
        <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          <div className="space-y-8">
            <WorkoutLogger />
            <ExerciseManager />
          </div>
          <div className="space-y-8">
            <ProgressGraph />
            <WorkoutStats />
          </div>
        </div>
        
        <div className="w-full max-w-7xl mb-16">
          <RecentLogsTable />
        </div>
        
        <footer className="text-center">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Workout Tracker</h3>
            </div>
            <p className="text-purple-200 mb-6 text-lg leading-relaxed">
              Transform your fitness journey with beautiful progress tracking and powerful analytics
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-purple-300">
              <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">React</span>
              <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">Firebase</span>
              <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">Chart.js</span>
              <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">Tailwind CSS</span>
              <span className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">TypeScript</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}