import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function Attendance() {
  // Role selection state: 'student', 'tpo', or 'management'
  const [role, setRole] = useState('student');

  // Student-specific state: track job application status
  const [applications, setApplications] = useState({});

  // Dummy job opportunities (reused for different roles)
  const jobs = [
    { id: 1, title: 'Frontend Developer', status: 'Not Applied' },
    { id: 2, title: 'Backend Developer', status: 'Not Applied' },
    { id: 3, title: 'Data Analyst', status: 'Not Applied' },
  ];

  // Student: Apply for a job by updating the application status
  const applyForJob = (jobId) => {
    setApplications({ ...applications, [jobId]: 'Applied' });
  };

  // TPO Admin: Schedule an interview for a specific job
  const scheduleInterview = (jobId) => {
    alert(`Interview scheduled for job ID ${jobId}`);
  };

  // Management Admin: View reports (dummy functionality)
  const viewReports = () => {
    alert('Displaying placement reports...');
  };

  // Management Admin: Analyze data (dummy functionality)
  const analyzeData = () => {
    alert('Analyzing placement data...');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Placement Portal</h1>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="tpo">TPO Admin</option>
          <option value="management">Management Admin</option>
        </select>
      </div>

      {/* Student Portal */}
      {role === 'student' && (
        <div>
          <h2>Student Portal</h2>
          <h3>Available Job Opportunities</h3>
          <ul>
            {jobs.map((job) => (
              <li key={job.id} style={{ marginBottom: '10px' }}>
                <strong>{job.title}</strong> - Application Status:{' '}
                {applications[job.id] || job.status}
                {!applications[job.id] && (
                  <button
                    style={{ marginLeft: '10px' }}
                    onClick={() => applyForJob(job.id)}
                  >
                    Apply
                  </button>
                )}
              </li>
            ))}
          </ul>
          <h3>Application Tracking</h3>
          <p>
            {Object.keys(applications).length > 0
              ? 'Your applications are being processed.'
              : 'No applications yet.'}
          </p>
        </div>
      )}

      {/* TPO Admin Portal */}
      {role === 'tpo' && (
        <div>
          <h2>TPO Admin Portal</h2>
          <h3>Manage Job Postings</h3>
          <ul>
            {jobs.slice(0, 2).map((job) => (
              <li key={job.id} style={{ marginBottom: '10px' }}>
                <strong>{job.title}</strong> - Posted
                <button
                  style={{ marginLeft: '10px' }}
                  onClick={() => scheduleInterview(job.id)}
                >
                  Schedule Interview
                </button>
              </li>
            ))}
          </ul>
          <h3>Track Student Progress</h3>
          <p>Student progress details would be displayed here.</p>
        </div>
      )}

      {/* Management Admin Portal */}
      {role === 'management' && (
        <div>
          <h2>Management Admin Portal</h2>
          <h3>Overview of Placement Process</h3>
          <p>
            This section provides an overview of the placement process along with key statistics.
          </p>
          <div>
            <button onClick={viewReports} style={{ marginRight: '10px' }}>
              View Reports
            </button>
            <button onClick={analyzeData}>Analyze Data</button>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<Attendance />, document.getElementById('root'));
