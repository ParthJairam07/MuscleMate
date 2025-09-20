import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

interface Log {
  username: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: Timestamp | Date;
  notes?: string;
}

interface Stats {
  totalWorkouts: number;
  totalWeight: number;
  averageWeight: number;
  personalRecords: { exercise: string; weight: number; reps: number; date: string }[];
  recentActivity: number;
}

export default function WorkoutStats() {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const usersSnap = await getDocs(collection(db, "users"));
      setUsers(usersSnap.docs.map(doc => doc.data().username));
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      setStats(null);
      return;
    }
    fetchStats();
  }, [selectedUser]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Simplified query without orderBy to avoid index requirement
      const logsSnap = await getDocs(
        query(
          collection(db, "workoutLogs"),
          where("username", "==", selectedUser)
        )
      );
      
      const logs = logsSnap.docs.map(doc => doc.data() as Log).sort((a, b) => {
        // Sort by date descending manually
        const dateA = (a.date as any).toDate ? (a.date as any).toDate() : new Date(a.date);
        const dateB = (b.date as any).toDate ? (b.date as any).toDate() : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
      
      // Calculate stats
      const totalWorkouts = logs.length;
      const totalWeight = logs.reduce((sum, log) => sum + (log.weight * log.reps), 0);
      const averageWeight = totalWorkouts > 0 ? totalWeight / totalWorkouts : 0;
      
      // Find personal records (highest weight for each exercise)
      const exerciseRecords = new Map<string, { weight: number; reps: number; date: string }>();
      
      logs.forEach(log => {
        const key = log.exerciseName;
        const currentRecord = exerciseRecords.get(key);
        const logWeight = log.weight;
        
        if (!currentRecord || logWeight > currentRecord.weight) {
          exerciseRecords.set(key, {
            weight: logWeight,
            reps: log.reps,
            date: formatDate(log.date)
          });
        }
      });
      
      const personalRecords = Array.from(exerciseRecords.entries()).map(([exercise, record]) => ({
        exercise,
        ...record
      }));
      
      // Recent activity (workouts in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const recentActivity = logs.filter(log => {
        const logDate = (log.date as Timestamp).toDate ? (log.date as Timestamp).toDate() : log.date as Date;
        return logDate >= weekAgo;
      }).length;
      
      setStats({
        totalWorkouts,
        totalWeight: Math.round(totalWeight),
        averageWeight: Math.round(averageWeight * 10) / 10,
        personalRecords,
        recentActivity
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  function formatDate(dateObj: Timestamp | Date) {
    let d: Date;
    if ((dateObj as Timestamp).toDate)
      d = (dateObj as Timestamp).toDate();
    else
      d = dateObj as Date;
    return d.toLocaleDateString("en-GB");
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📊</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Workout Statistics</h2>
            <p className="text-orange-200 text-sm">Comprehensive fitness analytics and insights</p>
          </div>
        </div>
        {stats && (
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{stats.totalWorkouts}</div>
            <div className="text-orange-200 text-sm">Total Workouts</div>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <label className="block font-semibold text-white mb-3 text-lg">Select User</label>
        <select
          className="w-full md:w-80 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-all duration-300"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="" className="bg-slate-800 text-white">Select User</option>
          {users.map(u => <option key={u} className="bg-slate-800 text-white">{u}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-4 py-12">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-medium text-lg">Loading statistics...</span>
        </div>
      ) : stats ? (
        <div className="space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-sm bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-400/30 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-blue-300 text-2xl">💪</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{stats.totalWorkouts}</div>
                  <div className="text-sm text-blue-200 font-medium">Total Workouts</div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-400/30 hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-green-300 text-2xl">⚖️</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{stats.totalWeight}</div>
                  <div className="text-sm text-green-200 font-medium">Total Volume</div>
                </div>
              </div>
            </div>
            <div className="backdrop-blur-sm bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-400/30 hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-purple-300 text-2xl">🔥</span>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{stats.recentActivity}</div>
                  <div className="text-sm text-purple-200 font-medium">This Week</div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Records */}
          {stats.personalRecords.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🏆</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Personal Records</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.personalRecords.slice(0, 6).map((record, idx) => (
                  <div key={idx} className="backdrop-blur-sm bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-white text-lg group-hover:text-yellow-300 transition-colors duration-300">{record.exercise}</div>
                      <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-yellow-300 text-sm">🏆</span>
                      </div>
                    </div>
                    <div className="text-sm text-purple-200 font-medium mb-1">
                      {record.weight} lbs × {record.reps} reps
                    </div>
                    <div className="text-xs text-purple-300">{record.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Average Weight */}
          <div className="backdrop-blur-sm bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl p-6 border border-indigo-400/30 hover:from-indigo-500/30 hover:to-blue-500/30 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors duration-300">Average Workout Volume</div>
                <div className="text-4xl font-bold text-white group-hover:scale-105 transition-transform duration-300">{stats.averageWeight}</div>
                <div className="text-sm text-indigo-200 font-medium">Weight × Reps per workout</div>
              </div>
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-indigo-300 text-3xl">📊</span>
              </div>
            </div>
          </div>
        </div>
        ) : selectedUser ? (
          <div className="text-center py-12">
            <div className="backdrop-blur-sm bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-8">
              <div className="text-yellow-400 text-6xl mb-6">📊</div>
              <h3 className="text-2xl font-semibold text-yellow-200 mb-4">No Workout Data Found</h3>
              <p className="text-yellow-300 mb-6 text-lg">
                This user hasn't logged any workouts yet. Start logging workouts to see statistics!
              </p>
              <div className="text-sm text-yellow-400 bg-white/10 rounded-xl p-4">
                <p className="font-semibold mb-3">To get started:</p>
                <ol className="list-decimal list-inside space-y-2 text-left max-w-md mx-auto">
                  <li>Go to "Log Your Workout" section</li>
                  <li>Select this user and an exercise</li>
                  <li>Enter weight and reps</li>
                  <li>Click "Log Workout"</li>
                  <li>Come back here to see your stats!</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-8">
              <div className="text-blue-400 text-6xl mb-6">👤</div>
              <h3 className="text-2xl font-semibold text-blue-200 mb-4">Select a User</h3>
              <p className="text-blue-300 text-lg">
                Choose a user from the dropdown above to view their workout statistics.
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
