import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection, getDocs, query, where, orderBy,
  Timestamp,
} from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

interface Log {
  weight: number;
  reps: number;
  date: Timestamp | Date;
}

export default function ProgressGraph() {
  const [users, setUsers] = useState<string[]>([]);
  const [exercises, setExercises] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [workouts, setWorkouts] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchMeta() {
      const usersSnap = await getDocs(collection(db, "users"));
      setUsers(usersSnap.docs.map((doc) => doc.data().username));
      const exSnap = await getDocs(collection(db, "exercises"));
      setExercises(exSnap.docs.map((doc) => doc.data().name));
    }
    fetchMeta();
  }, []);

  useEffect(() => {
    if (!selectedUser || !selectedExercise) {
      setWorkouts([]);
      return;
    }
    setLoading(true);
    async function fetchLogs() {
      try {
        // Simplified query without orderBy to avoid index requirement
        const q = query(
          collection(db, "workoutLogs"),
          where("username", "==", selectedUser),
          where("exerciseName", "==", selectedExercise)
        );
        const logsSnap = await getDocs(q);
        const workoutData = logsSnap.docs.map(doc => doc.data() as Log).sort((a, b) => {
          // Sort by date ascending manually
          const dateA = (a.date as any).toDate ? (a.date as any).toDate() : new Date(a.date);
          const dateB = (b.date as any).toDate ? (b.date as any).toDate() : new Date(b.date);
          return dateA.getTime() - dateB.getTime();
        });
        setWorkouts(workoutData);
      } catch {
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [selectedUser, selectedExercise]);

  function formatDate(dateObj: Timestamp | Date) {
    let d: Date;
    if ((dateObj as Timestamp).toDate)
      d = (dateObj as Timestamp).toDate();
    else
      d = dateObj as Date;
    return d.toLocaleDateString("en-GB").slice(0, 8);
  }

  const chartData = {
    labels: workouts.map(w => formatDate(w.date)),
    datasets: [
      {
        label: "Progress (weight × reps / 10)",
        data: workouts.map(w => (w.weight * w.reps) / 10),
        borderColor: "#8b5cf6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#a855f7",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    },
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#8b5cf6',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          title: () => 'Workout Progress',
          label: (ctx: any) => {
            const idx = ctx.dataIndex;
            const w = workouts[idx];
            return [
              `Progress Score: ${(w.weight * w.reps / 10).toFixed(2)}`,
              `Max Weight: ${w.weight} lbs`,
              `Reps: ${w.reps}`,
              `Date: ${formatDate(w.date)}`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#a855f7',
          font: {
            size: 12,
            weight: '500'
          }
        },
        title: { 
          display: true, 
          text: "Date (DD/MM/YY)",
          color: '#ffffff',
          font: {
            size: 14,
            weight: '600'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#a855f7',
          font: {
            size: 12,
            weight: '500'
          }
        },
        title: { 
          display: true, 
          text: "Progress Score",
          color: '#ffffff',
          font: {
            size: 14,
            weight: '600'
          }
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl">📈</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Strength Progress</h2>
            <p className="text-purple-200 text-sm">Track your workout improvements over time</p>
          </div>
        </div>
        {workouts.length > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{workouts.length}</div>
            <div className="text-purple-200 text-sm">Data Points</div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block font-semibold text-white mb-3 text-lg">User</label>
          <select
            value={selectedUser}
            onChange={e => setSelectedUser(e.target.value)}
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
          >
            <option value="" className="bg-slate-800 text-white">Select User</option>
            {users.map(u => <option key={u} className="bg-slate-800 text-white">{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-semibold text-white mb-3 text-lg">Exercise</label>
          <select
            value={selectedExercise}
            onChange={e => setSelectedExercise(e.target.value)}
            className="w-full backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-300"
          >
            <option value="" className="bg-slate-800 text-white">Select Exercise</option>
            {exercises.map(name => <option key={name} className="bg-slate-800 text-white">{name}</option>)}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center gap-4 py-12">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white font-medium text-lg">Loading progress data...</span>
        </div>
      ) : workouts.length === 0 && (selectedUser && selectedExercise) ? (
        <div className="text-center py-12">
          <div className="backdrop-blur-sm bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-8">
            <div className="text-yellow-400 text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-yellow-200 mb-2">No Progress Data Yet</h3>
            <p className="text-yellow-300 mb-4">
              Start logging workouts for {selectedExercise} to see your progress!
            </p>
            <div className="text-sm text-yellow-400">
              <p><strong>Progress is calculated as:</strong> (Weight × Reps) ÷ 10</p>
            </div>
          </div>
        </div>
      ) : workouts.length > 0 ? (
        <div className="h-80 bg-white/5 rounded-2xl p-6 border border-white/10">
          <Line data={chartData} options={chartOptions as any} />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-2xl p-8">
            <div className="text-blue-400 text-6xl mb-4">📈</div>
            <h3 className="text-xl font-semibold text-blue-200 mb-2">Select User & Exercise</h3>
            <p className="text-blue-300">
              Choose a user and exercise to view their strength progress over time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}