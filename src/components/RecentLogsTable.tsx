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
          const dateA = (a.date as any).toDate ? (a.date as any).toDate() : new Date(a.date);
          const dateB = (b.date as any).toDate ? (b.date as any).toDate() : new Date(b.date);
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 overflow-x-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-purple-600 text-xl">📋</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Recent Workout Logs</h2>
      </div>
      <div className="mb-6">
        <label className="block font-semibold text-gray-700 mb-2">Filter by User</label>
        <select
          className="w-full md:w-64 border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:outline-none transition-colors"
          value={selectedUser}
          onChange={e => setSelectedUser(e.target.value)}
        >
          <option value="">Select User</option>
          {users.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
      {loading ? (
        <div className="flex items-center gap-2"><span className="loader"></span>Loading...</div>
      ) : logs.length === 0 && selectedUser ? (
        <div className="text-gray-500 mt-4">No logs found for this user.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Exercise</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Weight (lbs)</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Reps</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, idx) => (
                <tr key={idx} className={`border-b hover:bg-gray-50 transition-colors ${idx % 2 ? "bg-gray-25" : ""}`}>
                  <td className="px-4 py-3 font-medium text-gray-900">{formatDate(log.date)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {log.username}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{log.exerciseName}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{log.weight}</td>
                  <td className="px-4 py-3 font-bold text-blue-600">{log.reps}</td>
                  <td className="px-4 py-3 text-gray-600">{log.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}