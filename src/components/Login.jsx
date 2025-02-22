import React, { useState } from "react";

const Alert = ({ children, variant = "info" }) => {
  const baseClasses = "p-3 rounded-md mb-4 text-center";
  const variants = {
    info: "bg-violet-500/50 text-white",
    error: "bg-red-500/50 text-white"
  };

  return (
    <div className={`${baseClasses} ${variants[variant]}`}>
      {children}
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    email: ""
  });
  const [userType, setUserType] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isCollegeEmail = (email) => {
    return email.toLowerCase().endsWith("@vit.edu");
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userType) {
      setError("Please select a user type");
      return;
    }

    if (!isCollegeEmail(credentials.email)) {
      setError("Please use your college email (@vit.edu)");
      return;
    }

    setIsLoading(true);
    setMessage("Authenticating...");

    try {
      // Simulate API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onLogin({ 
        ...credentials, 
        userType 
      });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-400 to-slate-300 dark:from-slate-800 dark:to-slate-950">
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        {message && (
          <Alert>
            {message}
          </Alert>
        )}

        <div className="mb-6 flex items-center gap-2">
          <div className="text-4xl text-slate-900 dark:text-slate-300">🏛️</div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-300">
            Kollege
          </h1>
        </div>

        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-slate-900">
          <div className="mb-6 flex w-full rounded-t-lg border-b dark:border-slate-700">
            <label className="flex w-1/2 cursor-pointer flex-col items-center p-4">
              <input
                type="radio"
                value="staff"
                name="userType"
                className="mb-2"
                onChange={() => setUserType("staff")}
              />
              <span className="flex items-center gap-2">
                👤 Staff
              </span>
            </label>
            <label className="flex w-1/2 cursor-pointer flex-col items-center p-4">
              <input
                type="radio"
                value="student"
                name="userType"
                className="mb-2"
                onChange={() => setUserType("student")}
              />
              <span className="flex items-center gap-2">
                👨‍🎓 Student
              </span>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="College Email"
                className="w-full rounded-md border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full rounded-md border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-800"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full rounded-md border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-800"
                required
              />
            </div>

            {error && (
              <Alert variant="error">
                {error}
              </Alert>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-violet-600 p-3 text-white hover:bg-violet-700 disabled:bg-violet-400"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center">
              <span className="text-slate-600 dark:text-slate-400">
                New user?{" "}
              </span>
              <button
                type="button"
                className="text-violet-600 hover:underline dark:text-violet-400"
                onClick={() => setMessage("Registration feature coming soon!")}
              >
                Register here
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;