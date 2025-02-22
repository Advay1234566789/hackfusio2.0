// TeacherRecord.js
import React, { useState, useEffect } from "react";

const backendUrl = "http://localhost:4500";

const TeacherRecord = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");
  const [teacherInputs, setTeacherInputs] = useState({
    studentName: "",
    branch: "",
    department: ""
  });

  // Fetch existing cheating records from the backend
  const fetchRecords = async () => {
    try {
      const res = await fetch(`${backendUrl}/cheating-records`);
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      setError("Failed to fetch records: " + err.message);
    }
  };

  // Handle input changes for teacher's form
  const handleInputChange = (field, value) => {
    setTeacherInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Add a new cheating record by posting teacher inputs to the backend
  const handleAddRecord = async () => {
    const { studentName, branch, department } = teacherInputs;
    if (!studentName || !branch || !department) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await fetch(`${backendUrl}/cheating-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName, branch, department })
      });
      if (!res.ok) throw new Error("Failed to add record");
      // Reset form inputs upon successful addition
      setTeacherInputs({ studentName: "", branch: "", department: "" });
      fetchRecords();
    } catch (err) {
      setError("Failed to add record: " + err.message);
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
      <header className="bg-gradient-to-r from-green-500 to-teal-600 py-6 shadow-lg mb-8">
        <h1 className="text-4xl font-bold text-center">Teacher Cheating Record</h1>
      </header>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Add Cheating Record</h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Student Name"
            value={teacherInputs.studentName}
            onChange={(e) => handleInputChange("studentName", e.target.value)}
            className="p-2 rounded bg-gray-700"
          />
          <input
            type="text"
            placeholder="Branch"
            value={teacherInputs.branch}
            onChange={(e) => handleInputChange("branch", e.target.value)}
            className="p-2 rounded bg-gray-700"
          />
          <input
            type="text"
            placeholder="Department"
            value={teacherInputs.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            className="p-2 rounded bg-gray-700"
          />
          <button
            onClick={handleAddRecord}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
          >
            Add Record
          </button>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Cheating Records</h2>
        {records.length === 0 ? (
          <p>No records found.</p>
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
    </div>
  );
};

export default TeacherRecord;
