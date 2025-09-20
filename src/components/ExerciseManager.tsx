import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

interface Exercise {
  id: string;
  name: string;
  day: string;
}

const DEFAULT_EXERCISES = [
  { name: "Bench Press", day: "Chest" },
  { name: "Squat", day: "Legs" },
  { name: "Deadlift", day: "Back" },
  { name: "Overhead Press", day: "Shoulders" },
  { name: "Barbell Row", day: "Back" },
  { name: "Pull-ups", day: "Back" },
  { name: "Dips", day: "Chest" },
  { name: "Lunges", day: "Legs" },
  { name: "Bicep Curls", day: "Arms" },
  { name: "Tricep Extensions", day: "Arms" },
  { name: "Plank", day: "Core" },
  { name: "Russian Twists", day: "Core" },
  { name: "Leg Press", day: "Legs" },
  { name: "Lat Pulldown", day: "Back" },
  { name: "Chest Fly", day: "Chest" },
  { name: "Shoulder Press", day: "Shoulders" },
  { name: "Lateral Raises", day: "Shoulders" },
  { name: "Hammer Curls", day: "Arms" },
  { name: "Calf Raises", day: "Legs" },
  { name: "Mountain Climbers", day: "Cardio" }
];

export default function ExerciseManager() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [newExercise, setNewExercise] = useState({ name: "", day: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const exSnap = await getDocs(collection(db, "exercises"));
      setExercises(exSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Exercise)));
    } catch (err) {
      setError("Failed to load exercises.");
    } finally {
      setLoading(false);
    }
  };

  const addDefaultExercises = async () => {
    setError("");
    setSuccess("");
    try {
      for (const exercise of DEFAULT_EXERCISES) {
        await addDoc(collection(db, "exercises"), exercise);
      }
      await fetchExercises();
      setSuccess("Default exercises added successfully!");
    } catch (err) {
      setError("Failed to add default exercises.");
    }
  };

  const addExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!newExercise.name.trim() || !newExercise.day.trim()) {
      setError("Please fill in both name and day.");
      return;
    }

    try {
      await addDoc(collection(db, "exercises"), {
        name: newExercise.name.trim(),
        day: newExercise.day.trim()
      });
      setNewExercise({ name: "", day: "" });
      await fetchExercises();
      setSuccess("Exercise added successfully!");
    } catch (err) {
      setError("Failed to add exercise.");
    }
  };

  const deleteExercise = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exercise?")) return;
    
    try {
      await deleteDoc(doc(db, "exercises", id));
      await fetchExercises();
      setSuccess("Exercise deleted successfully!");
    } catch (err) {
      setError("Failed to delete exercise.");
    }
  };

  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20">
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-medium">Loading exercises...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">💪</span>
          </div>
          Exercise Management
        </h2>
        <div className="text-sm text-purple-200 bg-white/10 px-3 py-1 rounded-full">
          {exercises.length} exercises
        </div>
      </div>
      
      {exercises.length === 0 && (
        <div className="mb-6 backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-6">
          <p className="text-blue-200 mb-4 font-medium">No exercises found. Add some default exercises to get started!</p>
          <button
            onClick={addDefaultExercises}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Add Default Exercises
          </button>
        </div>
      )}

      <form onSubmit={addExercise} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
              placeholder="Exercise name..."
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={newExercise.day}
              onChange={(e) => setNewExercise({ ...newExercise, day: e.target.value })}
              className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
              placeholder="Muscle group..."
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            Add
          </button>
        </div>
      </form>

      {success && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-400/30 rounded-xl text-green-200 font-medium">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-400/30 rounded-xl text-red-200 font-medium">
          {error}
        </div>
      )}

      <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400/50 scrollbar-track-transparent">
        <div className="space-y-2">
          {exercises.map((exercise) => (
            <div key={exercise.id} className="flex items-center justify-between backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 group">
              <div className="flex-1">
                <div className="font-semibold text-white text-lg">{exercise.name}</div>
                <div className="text-purple-300 text-sm">{exercise.day}</div>
              </div>
              <button
                onClick={() => deleteExercise(exercise.id)}
                className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 group-hover:scale-110"
                title="Delete exercise"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
