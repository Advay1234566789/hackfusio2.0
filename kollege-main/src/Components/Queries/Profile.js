import React, { useState, useEffect } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockUser = {
    userType: "student",
    name: "John Smith",
    role: "Student",
    _id: "123",
  };

  const mockProfile = {
    name: "Bret Graham",
    email: "Bret.Graham@university.edu",
    studentId: "ST2024001",
    division: "Division A",
    department: "Electronics & Telecommunication",
    course: "B.Tech",
    semester: "6th Semester",
    batch: "2021-2025",
    contactNumber: "+1 (555) 123-4567",
    address: "123 University Avenue, Academic City",
    attendance: "85%",
    cgpa: "8.9",
  };

  useEffect(() => {
    setTimeout(() => {
      setProfile(mockProfile);
      setIsLoading(false);
    }, 1000);
  }, []);

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
      <div className="w-5 h-5 mt-1 text-violet-500">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-400">{label}</p>
        <p className="text-base text-white">{value}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-4xl">
          <div className="flex items-center space-x-4">
            <div className="h-24 w-24 bg-gray-700 rounded-full animate-pulse"></div>
            <div className="space-y-2 flex-1">
              <div className="h-8 w-48 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="mt-4 h-6 w-full bg-gray-700 rounded animate-pulse"></div>
          <div className="mt-2 h-4 w-full bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 md:h-32 md:w-32 bg-violet-800 text-violet-300 rounded-full flex items-center justify-center text-xl font-bold">
                🎓
              </div>
              <div className="absolute bottom-2 right-2 bg-violet-600 text-white px-2 py-1 text-xs rounded">
                {mockUser.userType}
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-sm bg-gray-700 rounded">
                  {mockUser.role}
                </span>
                <span className="px-2 py-1 text-sm bg-gray-700 rounded">
                  {profile.studentId}
                </span>
                <span className="px-2 py-1 text-sm bg-gray-700 rounded">
                  CGPA: {profile.cgpa}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="font-semibold text-lg">Academic Information</h3>
            <div className="space-y-4 mt-4">
              <InfoRow label="Department" value={profile.department} />
              <InfoRow label="Course" value={profile.course} />
              <InfoRow label="Division" value={profile.division} />
              <InfoRow label="Batch" value={profile.batch} />
              <InfoRow label="Semester" value={profile.semester} />
            </div>
          </div>
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div className="space-y-4 mt-4">
              <InfoRow label="Email" value={profile.email} />
              <InfoRow label="Phone" value={profile.contactNumber} />
              <InfoRow label="Address" value={profile.address} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
