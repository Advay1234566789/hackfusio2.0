import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const backendUrl = "http://localhost:5000";

const TeacherRecord = () => {
  // States for records, loading, notifications, form inputs, and filters.
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [teacherInputs, setTeacherInputs] = useState({
    studentName: "",
    branch: "",
    department: "",
    status: "Pending", // default status
  });
  // editingRecordId is null if not editing; otherwise holds the record _id
  const [editingRecordId, setEditingRecordId] = useState(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  // Toggle for filter display
  const [showFilters, setShowFilters] = useState(false);

  // Helper: show a notification message (clears after 3 sec)
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  // Fetch records from backend with loading indicator
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/cheating-records`);
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      showNotification("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update form state on input changes
  const handleInputChange = (field, value) => {
    setTeacherInputs((prev) => ({ ...prev, [field]: value }));
  };

  // Add a new record
  const handleAddRecord = async () => {
    const { studentName, branch, department, status } = teacherInputs;
    if (!studentName || !branch || !department) {
      showNotification("All fields are required");
      return;
    }
    const newRecord = {
      studentName,
      branch,
      department,
      status,
      timestamp: new Date().toISOString(),
    };
    try {
      const res = await fetch(`${backendUrl}/cheating-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
      if (!res.ok) throw new Error("Failed to add record");
      showNotification("Record added successfully!");
      setTeacherInputs({
        studentName: "",
        branch: "",
        department: "",
        status: "Pending",
      });
      fetchRecords();
    } catch (err) {
      showNotification("Failed to add record: " + err.message);
    }
  };

  // Update an existing record
  const handleUpdateRecord = async () => {
    const { studentName, branch, department, status } = teacherInputs;
    if (!studentName || !branch || !department) {
      showNotification("All fields are required");
      return;
    }
    const updatedRecord = {
      studentName,
      branch,
      department,
      status,
    };
    try {
      const res = await fetch(
        `${backendUrl}/cheating-records/${editingRecordId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRecord),
        }
      );
      if (!res.ok) throw new Error("Failed to update record");
      showNotification("Record updated successfully!");
      setTeacherInputs({
        studentName: "",
        branch: "",
        department: "",
        status: "Pending",
      });
      setEditingRecordId(null);
      fetchRecords();
    } catch (err) {
      showNotification("Failed to update record: " + err.message);
    }
  };

  // Delete a record
  const handleDeleteRecord = async (id) => {
    try {
      const res = await fetch(`${backendUrl}/cheating-records/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete record");
      showNotification("Record deleted successfully!");
      fetchRecords();
    } catch (err) {
      showNotification("Failed to delete record: " + err.message);
    }
  };

  // Edit: load record data into form
  const handleEditRecord = (record) => {
    setTeacherInputs({
      studentName: record.studentName,
      branch: record.branch,
      department: record.department,
      status: record.status || "Pending",
    });
    setEditingRecordId(record._id);
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setTeacherInputs({
      studentName: "",
      branch: "",
      department: "",
      status: "Pending",
    });
    setEditingRecordId(null);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filter records based on search and filters
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter ? record.branch === branchFilter : true;
    const matchesDepartment = departmentFilter
      ? record.department === departmentFilter
      : true;
    return matchesSearch && matchesBranch && matchesDepartment;
  });

  // Export filtered records as CSV
  const exportToCSV = () => {
    if (filteredRecords.length === 0) {
      showNotification("No records to export.");
      return;
    }
    const header = "Student Name,Branch,Department,Status,Timestamp\n";
    const csvRows = filteredRecords.map((r) =>
      [
        r.studentName,
        r.branch,
        r.department,
        r.status,
        r.timestamp ? new Date(r.timestamp).toLocaleString() : "",
      ].join(",")
    );
    const csvData = header + csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cheating_records.csv";
    a.click();
  };

  // Export filtered records as PDF using jsPDF
  const exportToPDF = () => {
    if (filteredRecords.length === 0) {
      showNotification("No records to export.");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Cheating Records", 10, 10);
    let yOffset = 20;
    filteredRecords.forEach((r, index) => {
      const line = `${index + 1}. ${r.studentName} | ${r.branch} | ${r.department} | ${r.status} | ${
        r.timestamp ? new Date(r.timestamp).toLocaleString() : ""
      }`;
      doc.text(line, 10, yOffset);
      yOffset += 10;
      // Add a new page if needed
      if (yOffset > 280) {
        doc.addPage();
        yOffset = 20;
      }
    });
    doc.save("cheating_records.pdf");
  };

  // Print view (print the current page)
  const handlePrint = () => {
    window.print();
  };

  // Prepare data for Dashboard Charts
  // Group by month (YYYY-MM)
  const monthlyData = {};
  filteredRecords.forEach((record) => {
    if (record.timestamp) {
      const date = new Date(record.timestamp);
      const month = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    }
  });
  const lineLabels = Object.keys(monthlyData).sort();
  const lineData = lineLabels.map((label) => monthlyData[label]);

  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Cheating Incidents per Month",
        data: lineData,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Group by branch for pie chart
  const branchData = {};
  filteredRecords.forEach((record) => {
    if (record.branch) {
      branchData[record.branch] = (branchData[record.branch] || 0) + 1;
    }
  });
  const pieLabels = Object.keys(branchData);
  const pieData = pieLabels.map((label) => branchData[label]);

  const pieChartData = {
    labels: pieLabels,
    datasets: [
      {
        label: "Incidents by Branch",
        data: pieData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#9b59b6",
          "#2ecc71",
        ],
      },
    ],
  };

  // Helper to format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <header className="bg-gradient-to-r from-green-500 to-teal-600 py-6 shadow-lg mb-8">
        <h1 className="text-4xl font-bold text-center">Teacher Cheating Record</h1>
      </header>

      {/* Navbar with both buttons aligned to the right */}
      <nav className="bg-gray-800 p-4 rounded mb-8 flex justify-end items-center gap-4">
        <button
          onClick={exportToCSV}
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
        >
          Export CSV
        </button>
        <button
          onClick={exportToPDF}
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
        >
          Export PDF
        </button>
        <button
          onClick={handlePrint}
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded"
        >
          Print
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <button
          onClick={fetchRecords}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
        >
          Refresh
        </button>
      </nav>

      {/* Conditionally display filter inputs */}
      {showFilters && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by student, branch or department"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded bg-gray-700 flex-1"
          />
          <input
            type="text"
            placeholder="Filter by Branch"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="p-2 rounded bg-gray-700 flex-1"
          />
          <input
            type="text"
            placeholder="Filter by Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="p-2 rounded bg-gray-700 flex-1"
          />
        </div>
      )}

      {notification && (
        <div className="bg-blue-500 p-3 rounded mb-4 text-center">
          {notification}
        </div>
      )}

      {/* Dashboard Section for Enhanced Data Visualization */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <Line data={lineChartData} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <Pie data={pieChartData} />
          </div>
        </div>
      </div>

      {/* Form Section for Add/Edit */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {editingRecordId ? "Edit Cheating Record" : "Add Cheating Record"}
        </h2>
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
          <select
            value={teacherInputs.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className="p-2 rounded bg-gray-700"
          >
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Resolved">Resolved</option>
          </select>
          <div className="flex gap-4">
            {editingRecordId ? (
              <>
                <button
                  onClick={handleUpdateRecord}
                  className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded"
                >
                  Update Record
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleAddRecord}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
              >
                Add Record
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && <p className="mb-4 text-center">Loading records...</p>}

      {/* Records List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Existing Cheating Records</h2>
        {filteredRecords.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <div className="grid gap-6">
            {filteredRecords.map((record) => (
              <div
                key={record._id}
                className="p-6 bg-gray-800 rounded-lg shadow-lg"
              >
                <h3 className="text-xl font-semibold">{record.studentName}</h3>
                <p className="text-sm text-gray-400">
                  Branch: {record.branch}
                </p>
                <p className="text-sm text-gray-400">
                  Department: {record.department}
                </p>
                {record.timestamp && (
                  <p className="text-xs text-gray-500">
                    Added on: {formatTimestamp(record.timestamp)}
                  </p>
                )}
                {record.status && (
                  <p className="text-xs text-gray-500">
                    Status: {record.status}
                  </p>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEditRecord(record)}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(record._id)}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherRecord;
