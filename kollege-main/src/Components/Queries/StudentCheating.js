// StudentCheating.js
import React, { useState, useEffect } from "react";

const backendUrl = "http://localhost:5000";

const StudentCheating = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  // Fetch the cheating records from the backend
  const fetchRecords = async () => {
    try {
      const res = await fetch(`${backendUrl}/cheating-records`);
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      setError("Failed to fetch records: " + err.message);
    }
  };

  // Poll the backend every 2 seconds for updated records
  useEffect(() => {
    fetchRecords();
    const interval = setInterval(fetchRecords, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 shadow-lg mb-8">
        <h1 className="text-4xl font-bold text-center">Student Cheating Records</h1>
      </header>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {records.length === 0 ? (
        <p>No cheating records available.</p>
      ) : (
        <div className="grid gap-6">
          {records.map((record) => (
            <div key={record._id} className="p-6 bg-gray-800 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold">{record.studentName}</h3>
              <p className="text-sm text-gray-400">Branch: {record.branch}</p>
              <p className="text-sm text-gray-400">Department: {record.department}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentCheating;
