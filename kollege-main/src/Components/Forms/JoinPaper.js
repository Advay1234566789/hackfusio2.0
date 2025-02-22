import React, { useState } from 'react';
import axios from 'axios';
import Tesseract from 'tesseract.js';

const API_URL = 'http://localhost:4500/api';

const ScholarshipManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('display');
  const [scholarships] = useState([
    { id: 1, title: 'STEM Excellence Scholarship', description: 'For students excelling in STEM fields.' },
    { id: 2, title: 'Community Service Award', description: 'Awarded to students with outstanding community service.' },
    { id: 3, title: 'Academic Merit Scholarship', description: 'For students with excellent academic records.' },
    { id: 4, title: 'Leadership Excellence Scholarship', description: 'Recognizes exemplary leadership qualities.' },
    { id: 5, title: 'Arts and Culture Scholarship', description: 'For students contributing to arts and culture.' },
    { id: 6, title: 'Sports Achievement Scholarship', description: 'Awarded to outstanding athletes.' },
    { id: 7, title: 'Entrepreneurship Scholarship', description: 'For innovative and entrepreneurial students.' },
    { id: 8, title: 'Environmental Sustainability Scholarship', description: 'For students advocating for environmental causes.' },
    { id: 9, title: 'International Exchange Scholarship', description: 'Supports students participating in exchange programs.' },
    { id: 10, title: 'Technology Innovation Scholarship', description: 'For students who develop innovative technologies.' },
    { id: 11, title: 'Health and Wellness Scholarship', description: 'For students promoting health and wellness initiatives.' },
    { id: 12, title: 'Literary Excellence Scholarship', description: 'For students with outstanding literary talent.' },
    { id: 13, title: 'Social Justice Scholarship', description: 'For students advocating for social justice and equality.' },
    { id: 14, title: 'Civic Engagement Scholarship', description: 'Awarded to students actively engaged in civic matters.' },
    { id: 15, title: 'Cultural Diversity Scholarship', description: 'For students promoting cultural diversity.' },
    { id: 16, title: 'Innovation in Education Scholarship', description: 'For students implementing creative educational solutions.' },
    { id: 17, title: 'Research Excellence Scholarship', description: 'Awarded for outstanding research contributions.' },
    { id: 18, title: 'Community Leadership Scholarship', description: 'For students demonstrating strong community leadership.' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [ocrResult, setOcrResult] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantIncome, setApplicantIncome] = useState('');
  const [currentApplication, setCurrentApplication] = useState(null);

  const handleSearch = () => {
    const filteredScholarships = scholarships.filter(scholarship =>
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredScholarships);
  };

  // Navigate to the Details tab when Apply is clicked
  const handleApply = (scholarship) => {
    setSelectedScholarship(scholarship);
    setActiveTab('details');
  };

  // Handle submission of the details form
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    const newApplication = {
      ...selectedScholarship,
      applicationDate: new Date().toLocaleString(),
      status: 'Submitted',
      eligibility: 'Pending',
      applicantName,
      applicantIncome: Number(applicantIncome)
    };
    setApplications([...applications, newApplication]);
    setCurrentApplication(newApplication);
    addNotification(`Details submitted for "${newApplication.title}". Proceed to document verification.`);
    setSelectedScholarship(null);
    setApplicantName('');
    setApplicantIncome('');
    setActiveTab('ocr');
  };

  // Updated OCR-based document verification logic
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (file && currentApplication) {
      setUploadStatus("Processing...");
      setUploadError('');
      setOcrResult('');
      try {
        const { data: { text } } = await Tesseract.recognize(file, 'eng');
        setOcrResult(text);
        setUploadStatus("Completed");
        const lowerText = text.toLowerCase();
        // Extract a numeric income value after the word "income"
        const match = lowerText.match(/income\s*(?:is|:)?\s*(\d+)/);
        if (match && match[1]) {
          const extractedIncome = parseInt(match[1].replace(/,/g, ''), 10);
          if (extractedIncome < 800000) {
            addNotification("Document verified: Income criteria met. Application Selected.");
            updateApplicationStatus('Selected', 'Eligible');
          } else {
            addNotification("Document verification failed: Income criteria not met.");
            updateApplicationStatus('Rejected', 'Not Eligible');
          }
        } else if (lowerText.includes("income less than 800000")) {
          addNotification("Document verified: Criteria met. Application Selected.");
          updateApplicationStatus('Selected', 'Eligible');
        } else {
          addNotification("Document verification failed: Required income information missing.");
          updateApplicationStatus('Rejected', 'Not Eligible');
        }
      } catch (error) {
        setUploadStatus("Error");
        setUploadError("OCR failed. Please try again.");
      }
    }
  };

  // Helper function to update current application status
  const updateApplicationStatus = (status, eligibility) => {
    setApplications(applications.map(app => 
      app.id === currentApplication.id ? { ...app, status, eligibility } : app
    ));
    setCurrentApplication({ ...currentApplication, status, eligibility });
  };

  // Utility function to add a notification
  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleString()
    };
    setNotifications([newNotification, ...notifications]);
  };

  // Render a scholarship card
  const renderScholarshipItem = (scholarship) => (
    <li
      key={scholarship.id}
      className="bg-gray-800 shadow-md p-6 rounded-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105"
    >
      <h3 className="text-xl font-bold text-gray-100">{scholarship.title}</h3>
      <p className="mt-2 text-gray-300">{scholarship.description}</p>
      <button 
        onClick={() => handleApply(scholarship)}
        className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-full transition-colors duration-300"
      >
        Apply
      </button>
    </li>
  );

  // Render an application card with details
  const renderApplicationItem = (app) => (
    <li
      key={app.id}
      className="bg-gray-800 shadow-md p-6 rounded-lg hover:shadow-2xl transition-transform duration-300 transform hover:scale-105"
    >
      <h3 className="text-xl font-bold text-gray-100">{app.title}</h3>
      <p className="mt-2 text-gray-300">{app.description}</p>
      <p className="mt-2 text-sm text-gray-400">
        Submitted: {app.applicationDate} | Status: <span className="font-semibold">{app.status}</span>
      </p>
      {app.applicantName && (
        <p className="mt-1 text-sm text-gray-400">Applicant: {app.applicantName}</p>
      )}
      {app.applicantIncome && (
        <p className="mt-1 text-sm text-gray-400">Income: {app.applicantIncome}</p>
      )}
    </li>
  );

  // Render a notification item
  const renderNotificationItem = (notif) => (
    <li key={notif.id} className="bg-gray-800 shadow p-4 rounded mb-2 border-l-4 border-blue-500">
      <p className="text-gray-100">{notif.message}</p>
      <p className="text-xs text-gray-400">{notif.timestamp}</p>
    </li>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-500 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="text-5xl font-extrabold text-white text-center">Scholarship Management System</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Navigation Bar */}
        <nav className="mb-8">
          <ul className="flex flex-wrap justify-center space-x-4 border-b pb-4">
            {['search', 'display', 'details', 'ocr', 'applications', 'notifications'].map((tab) => (
              <li key={tab}>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium rounded-full transition-colors duration-300 ${
                    activeTab === tab
                      ? 'text-white bg-blue-600'
                      : 'text-gray-300 hover:text-white hover:bg-blue-500'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tab Content */}
        {activeTab === 'search' && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">Search Scholarships</h2>
            <div className="flex justify-center mb-6">
              <input
                type="text"
                placeholder="Enter scholarship keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-md p-3 border border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-800 text-gray-100"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r transition-colors duration-300"
              >
                Search
              </button>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchResults.map(renderScholarshipItem)}
            </ul>
          </div>
        )}

        {activeTab === 'display' && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">All Scholarships</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholarships.map(renderScholarshipItem)}
            </ul>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">Enter Your Details</h2>
            {selectedScholarship ? (
              <form onSubmit={handleDetailsSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <p className="mb-4 text-lg text-gray-100">
                  Applying for: <span className="font-bold text-blue-400">{selectedScholarship.title}</span>
                </p>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-600 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-gray-100"
                />
                <input
                  type="number"
                  placeholder="Your Income"
                  value={applicantIncome}
                  onChange={(e) => setApplicantIncome(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-600 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-gray-100"
                />
                <button type="submit" className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors duration-300">
                  Submit Details
                </button>
              </form>
            ) : (
              <p className="text-center text-gray-300">Please select a scholarship from the Search or Display tab.</p>
            )}
          </div>
        )}

        {activeTab === 'ocr' && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">Document Verification (OCR)</h2>
            <p className="mb-4 text-center text-gray-300">
              Upload your document (e.g., transcript or recommendation letter) for verification.
            </p>
            <input type="file" onChange={handleDocumentUpload} className="mb-4 block mx-auto" />
            {uploadStatus && <p className="text-center font-medium text-gray-100">{uploadStatus}</p>}
            {ocrResult && (
              <div>
                <h3 className="text-xl font-bold mt-4 text-gray-100">Extracted Text:</h3>
                <p className="mt-2 text-gray-200 whitespace-pre-wrap">{ocrResult}</p>
              </div>
            )}
            {uploadError && <p className="text-center text-red-500">{uploadError}</p>}
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">My Applications</h2>
            {applications.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applications.map(renderApplicationItem)}
              </ul>
            ) : (
              <p className="text-center text-gray-300">No applications submitted yet.</p>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-100 mb-6 text-center">Notifications</h2>
            {notifications.length > 0 ? (
              <ul className="max-w-lg mx-auto">
                {notifications.map(renderNotificationItem)}
              </ul>
            ) : (
              <p className="text-center text-gray-300">No notifications yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipManagementSystem;
