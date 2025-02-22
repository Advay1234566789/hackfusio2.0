import React, { useState } from 'react';
import { BarChart, Users, Calendar, FileText } from 'lucide-react';

const PlacementPortal = () => {
  const [role, setRole] = useState('student');
  const [activeTab, setActiveTab] = useState('opportunities');
  const [applications, setApplications] = useState({});

  const jobs = [
    { id: 1, title: 'Frontend Developer', company: 'Tech Corp', salary: '₹8-12 LPA', status: 'Not Applied' },
    { id: 2, title: 'Backend Developer', company: 'Innovation Labs', salary: '₹10-15 LPA', status: 'Not Applied' },
    { id: 3, title: 'Data Analyst', company: 'Data Insights', salary: '₹7-11 LPA', status: 'Not Applied' },
  ];

  const applyForJob = (jobId) => {
    setApplications({ ...applications, [jobId]: 'Applied' });
  };

  const scheduleInterview = (jobId) => {
    alert(`Interview scheduled for job ID ${jobId}`);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      'Not Applied': 'bg-gray-700 text-gray-200',
      'Applied': 'bg-blue-900 text-blue-200',
    };
    return (
      <span className={`${colors[status]} px-3 py-1 rounded-full text-sm font-medium`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg shadow-black/50 overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-100 mb-2">
            Campus Placement Portal
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Manage your placement journey efficiently
          </p>

          <div className="mb-6">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-48 px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="student">Student</option>
              <option value="tpo">TPO Admin</option>
              <option value="management">Management Admin</option>
            </select>
          </div>

          {role === 'student' && (
            <div>
              <div className="border-b border-gray-700 mb-6">
                <nav className="flex space-x-8">
                  {['opportunities', 'applications'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {activeTab === 'opportunities' && (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="bg-gray-700 rounded-lg border border-gray-600 p-6 hover:shadow-lg hover:shadow-black/50 transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg text-gray-200">{job.title}</h3>
                          <p className="text-gray-400">{job.company}</p>
                          <p className="text-gray-400">Package: {job.salary}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge status={applications[job.id] || job.status} />
                          {!applications[job.id] && (
                            <button 
                              onClick={() => applyForJob(job.id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'applications' && (
                <div className="bg-gray-700 rounded-lg border border-gray-600 p-6">
                  {Object.keys(applications).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(applications).map(([jobId, status]) => {
                        const job = jobs.find(j => j.id === parseInt(jobId));
                        return (
                          <div key={jobId} className="flex justify-between items-center p-4 bg-gray-600 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-200">{job.title}</h4>
                              <p className="text-sm text-gray-400">{job.company}</p>
                            </div>
                            <StatusBadge status={status} />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-gray-600 text-gray-200 p-4 rounded-lg">
                      You haven't applied to any positions yet. Check out the available opportunities!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {role === 'tpo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-gray-300" />
                    <h3 className="font-semibold text-gray-200">Active Applications</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-100">24</p>
                  <p className="text-gray-400">Across all positions</p>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-gray-300" />
                    <h3 className="font-semibold text-gray-200">Upcoming Interviews</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-100">8</p>
                  <p className="text-gray-400">Scheduled this week</p>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h3 className="font-semibold text-gray-200 mb-4">Recent Applications</h3>
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div key={job.id} className="flex justify-between items-center p-4 bg-gray-600 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-200">{job.title}</h4>
                        <p className="text-sm text-gray-400">5 new applications</p>
                      </div>
                      <button 
                        onClick={() => scheduleInterview(job.id)}
                        className="px-4 py-2 border border-gray-500 text-gray-200 rounded-lg hover:bg-gray-500 transition-colors"
                      >
                        Schedule Interviews
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {role === 'management' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart className="h-5 w-5 text-gray-300" />
                    <h3 className="font-semibold text-gray-200">Placement Statistics</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-100">85%</p>
                  <p className="text-gray-400">Overall placement rate</p>
                </div>
                <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-gray-300" />
                    <h3 className="font-semibold text-gray-200">Average Package</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-100">₹8.5 LPA</p>
                  <p className="text-gray-400">Current batch</p>
                </div>
              </div>

              <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                <h3 className="font-semibold text-gray-200 mb-4">Placement Progress</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-200">
                      <span>Total Students</span>
                      <span>120</span>
                    </div>
                    <div className="h-2 bg-gray-600 rounded-full">
                      <div className="h-2 bg-blue-600 rounded-full w-[85%]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-200">
                      <span>Placed Students</span>
                      <span>102</span>
                    </div>
                    <div className="h-2 bg-gray-600 rounded-full">
                      <div className="h-2 bg-green-600 rounded-full w-[72%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementPortal;