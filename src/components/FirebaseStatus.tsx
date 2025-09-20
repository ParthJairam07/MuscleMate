import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function FirebaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "error">("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    async function testConnection() {
      try {
        // Try to read from a collection to test connection
        await getDocs(collection(db, "users"));
        setStatus("connected");
      } catch (err) {
        console.error("Firebase connection error:", err);
        setStatus("error");
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    }
    testConnection();
  }, []);

  if (status === "checking") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-yellow-800 text-sm">Checking Firebase connection...</span>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <span className="text-red-600 text-lg">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-800 mb-1">Firebase Connection Error</h3>
            <p className="text-red-700 text-sm mb-2">
              Unable to connect to Firebase. Please check your configuration.
            </p>
            <details className="text-xs text-red-600">
              <summary className="cursor-pointer">Error details</summary>
              <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
            </details>
            <div className="mt-3 text-xs text-red-700">
              <p><strong>To fix this:</strong></p>
              <ol className="list-decimal list-inside space-y-1 mt-1">
                <li>Copy <code>.env.example</code> to <code>.env</code></li>
                <li>Fill in your Firebase configuration</li>
                <li>Make sure Firestore is enabled in your Firebase project</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <div className="flex items-center gap-2">
        <span className="text-green-600 text-lg">✅</span>
        <span className="text-green-800 text-sm">Firebase connected successfully</span>
      </div>
    </div>
  );
}
