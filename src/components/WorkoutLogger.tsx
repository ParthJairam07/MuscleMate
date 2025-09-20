import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, setDoc, doc, query, orderBy } from "firebase/firestore";

interface Exercise {
  id: string;
  name: string;
  day: string;
}

export default function WorkoutLogger() {
  const [users, setUsers] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState("");
  const [newUser, setNewUser] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        console.log("Fetching data from Firebase..."); // Debug log
        const usersSnap = await getDocs(collection(db, "users"));
        console.log("Users fetched:", usersSnap.docs.length); // Debug log
        setUsers(usersSnap.docs.map((doc) => doc.data().username));
        
        const exSnap = await getDocs(query(collection(db, "exercises"), orderBy("day")));
        console.log("Exercises fetched:", exSnap.docs.length); // Debug log
        setExercises(
          exSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Failed to load data:", err); // Debug log
        setError("Failed to load users or exercises. Please check your Firebase configuration.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleAddUser = async () => {
    setError(""); setSuccess("");
    const username = newUser.trim();
    if (!username) return setError("Username cannot be empty.");
    if (users.includes(username)) return setError("Username already exists.");
    
    try {
      console.log("Adding user:", username); // Debug log
      await setDoc(doc(db, "users", username), { username });
      console.log("User added successfully"); // Debug log
      setUsers((prev) => [...prev, username]);
      setSelectedUser(username);
      setNewUser("");
      setSuccess("User added successfully!");
    } catch (err) {
      console.error("Add user error:", err); // Debug log
      let msg = "Failed to add user.";
      if (err && typeof err === "object" && "message" in err) {
        msg += ` ${(err as any).message}`;
      }
      setError(msg);
    }
  };

  const addDefaultExercises = async () => {
    setError(""); setSuccess("");
    try {
      // First, get existing exercises to avoid duplicates
      const existingSnap = await getDocs(collection(db, "exercises"));
      const existingExercises = existingSnap.docs.map(doc => doc.data().name);
      
      const defaultExercises = [
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
      
      // Only add exercises that don't already exist
      const newExercises = defaultExercises.filter(ex => !existingExercises.includes(ex.name));
      
      if (newExercises.length === 0) {
        setSuccess("All default exercises already exist!");
        return;
      }
      
      for (const exercise of newExercises) {
        await addDoc(collection(db, "exercises"), exercise);
      }
      
      // Refresh exercises list
      const exSnap = await getDocs(query(collection(db, "exercises"), orderBy("day")));
      setExercises(exSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      
      setSuccess(`Added ${newExercises.length} new exercises! (${defaultExercises.length - newExercises.length} already existed)`);
    } catch (err) {
      console.error("Failed to add default exercises:", err);
      setError("Failed to add default exercises. Please check your Firebase connection.");
    }
  };

  const handleLogWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!selectedUser) return setError("Please select a user.");
    if (!selectedExercise) return setError("Please select an exercise.");
    const w = Number(weight), r = Number(reps);
    if (!w || w < 1) return setError("Enter a valid weight (>0).");
    if (!r || r < 1) return setError("Enter valid reps (>0).");
    if (w > 800 || r > 100) return setError("Unrealistic weight/reps.");
    try {
      await addDoc(collection(db, "workoutLogs"), {
        username: selectedUser,
        exerciseName: selectedExercise,
        weight: w,
        reps: r,
        date: new Date(),
        notes: notes.trim() || "",
      });
      setWeight(""); setReps(""); setNotes("");
      setSuccess("Workout logged!");
    } catch {
      setError("Failed to log workout.");
    }
  }


  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-white text-2xl">💪</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Log Your Workout</h2>
          <p className="text-purple-200 text-sm">Track your progress with every rep</p>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center gap-4 py-12">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-medium text-lg">Loading workout data...</span>
        </div>
      ) : (
        <form onSubmit={handleLogWorkout} className="space-y-6">
          <div>
            <label className="block font-semibold text-white mb-3 text-lg">User</label>
            {users.length === 0 ? (
              <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-6 mb-6">
                <p className="text-blue-200 text-sm mb-4 font-medium">No users found. Add your first user below to get started!</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={newUser}
                    onChange={e => setNewUser(e.target.value)}
                    className="flex-1 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
                  />
                  <button
                    type="button"
                    onClick={handleAddUser}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Add User
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <select
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                >
                  <option value="" className="bg-slate-800 text-white">Select user</option>
                  {users.map((u) => (
                    <option key={u} value={u} className="bg-slate-800 text-white">{u}</option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Add another user"
                    value={newUser}
                    onChange={e => setNewUser(e.target.value)}
                    className="flex-1 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddUser()}
                  />
                  <button
                    type="button"
                    onClick={handleAddUser}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Add User
                  </button>
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block font-semibold text-white mb-3 text-lg">Exercise</label>
            {exercises.length === 0 ? (
              <div className="backdrop-blur-sm bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl p-6 mb-6">
                <p className="text-orange-200 text-sm mb-4 font-medium">No exercises found. Add some exercises to get started!</p>
                <button
                  type="button"
                  onClick={addDefaultExercises}
                  className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Add Default Exercises
                </button>
              </div>
            ) : (
              <select
                value={selectedExercise}
                onChange={e => setSelectedExercise(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
              >
                <option value="" className="bg-slate-800 text-white">Select exercise</option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.name} className="bg-slate-800 text-white">
                    {`${ex.name} (${ex.day})`}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-white mb-3 text-lg">Weight (lbs)</label>
              <input
                type="number"
                min="1"
                max="800"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                placeholder="Enter weight"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-white mb-3 text-lg">Reps</label>
              <input
                type="number"
                min="1"
                max="100"
                value={reps}
                onChange={e => setReps(e.target.value)}
                className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
                placeholder="Enter reps"
                required
              />
            </div>
          </div>
          <div>
            <label className="block font-semibold text-white mb-3 text-lg">
              Notes <span className="text-purple-300 font-normal">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white placeholder-purple-300 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 resize-none"
              rows={3}
              placeholder="Add any notes about your workout..."
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            💪 Log Workout
          </button>
          {success && (
            <div className="backdrop-blur-sm bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 text-green-200 font-medium">
              ✅ {success}
            </div>
          )}
          {error && (
            <div className="backdrop-blur-sm bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-xl p-4 text-red-200 font-medium">
              ❌ {error}
            </div>
          )}
        </form>
      )}
    </div>
  );
}