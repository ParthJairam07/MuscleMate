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

export default function RecentLogsTable() {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [logs, setLogs] = useState<Log[]>([]);
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
      setLogs([]);
      return;
    }
    setLoading(true);
    async function fetchLogs() {
      try {
        // Simplified query without orderBy to avoid index requirement
        const q = query(
          collection(db, "workoutLogs"),
          where("username", "==", selectedUser)
        );
        const logsSnap = await getDocs(q);
        const logData = logsSnap.docs.map(doc => doc.data() as Log).sort((a, b) => {
          // Sort by date descending manually
          const dateA = (a.date as any).toDate ? (a.date as any).toDate() : new Date(a.date as Date);
          const dateB = (b.date as any).toDate ? (b.date as any).toDate() : new Date(b.date as Date);
          return dateB.getTime() - dateA.getTime();
        }).slice(0, 15); // Limit to 15 most recent
        setLogs(logData);
      } catch {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [selectedUser]);

  function formatDate(dateObj: Timestamp | Date) {
    let d: Date;
    if ((dateObj as Timestamp).toDate)
      d = (dateObj as Timestamp).toDate();
    else
      d = dateObj as Date;
    return d.toLocaleDateString("en-GB").slice(0, 8);
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 overflow-x-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📋</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Recent Workout Logs</h2>
            <p className="text-purple-200 text-sm">Latest workout entries and activities</p>
          </div>
        </div>
        {logs.length > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{logs.length}</div>
            <div className="text-purple-200 text-sm">Recent Logs</div>
          </div>
        )}
      </div>
      <div className="mb-8">
        <label className="block font-semibold text-white mb-3 text-lg">Filter by User</label>
        <select
          className="w-full md:w-80 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="" className="bg-slate-800 text-white">Select User</option>
          {users.map(u => <option key={u} className="bg-slate-800 text-white">{u}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="flex items-center justify-center gap-4 py-12">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-medium text-lg">Loading workout logs...</span>
        </div>
      ) : logs.length === 0 && selectedUser ? (
        <div className="text-center py-12">
          <div className="backdrop-blur-sm bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-8">
            <div className="text-yellow-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-yellow-200 mb-2">No Logs Found</h3>
            <p className="text-yellow-300">This user hasn't logged any workouts yet.</p>
          </div>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12">
          <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-8">
            <div className="text-blue-400 text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-blue-200 mb-2">Select a User</h3>
            <p className="text-blue-300">Choose a user to view their recent workout logs.</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="backdrop-blur-sm bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-b border-white/20">
                <th className="px-6 py-4 text-left font-semibold text-white">Date</th>
                <th className="px-6 py-4 text-left font-semibold text-white">User</th>
                <th className="px-6 py-4 text-left font-semibold text-white">Exercise</th>
                <th className="px-6 py-4 text-left font-semibold text-white">Weight (lbs)</th>
                <th className="px-6 py-4 text-left font-semibold text-white">Reps</th>
                <th className="px-6 py-4 text-left font-semibold text-white">Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className={`border-b border-white/10 hover:bg-white/5 transition-all duration-300 group ${idx % 2 ? "bg-white/5" : ""}`}>
                  <td className="px-6 py-4 font-medium text-white group-hover:text-purple-200 transition-colors duration-300">{formatDate(log.date)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30">
                      {log.username}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-white group-hover:text-purple-200 transition-colors duration-300">{log.exerciseName}</td>
                  <td className="px-6 py-4 font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">{log.weight}</td>
                  <td className="px-6 py-4 font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">{log.reps}</td>
                  <td className="px-6 py-4 text-purple-200 group-hover:text-purple-100 transition-colors duration-300">{log.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}