import { useState, useContext, useMemo } from "react";
import emailjs from "@emailjs/browser";
import UserContext from "../../Hooks/UserContext";
import ErrorStrip from "../ErrorStrip";

// Card Component
const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-6">{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

// Badge Component
const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-slate-900 text-slate-50",
    secondary: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Tabs Components
const Tabs = ({ value, children, className = "" }) => (
  <div className={`w-full ${className}`}>{children}</div>
);

const TabsList = ({ children, className = "" }) => (
  <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400 ${className}`}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, className = "" }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${className}`}
    role="tab"
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, currentValue }) => (
  value === currentValue ? <div>{children}</div> : null
);

// Main Component
const HealthLeaveNotifications = () => {
  const { user } = useContext(UserContext);
  const [currentStep, setCurrentStep] = useState("doctorUpdate");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  // Doctor's Update states (Step 1)
  const [sickReason, setSickReason] = useState("");
  const [additionalSymptoms, setAdditionalSymptoms] = useState("");
  const [severity, setSeverity] = useState("");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [coordinatorEmail, setCoordinatorEmail] = useState("");
  const [className, setClassName] = useState("");

  // Leave Report states (Step 2)
  const [leaveReason, setLeaveReason] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  // Email sending function using EmailJS
  const sendEmail = async (templateId, templateParams) => {
    try {
      await emailjs.send(
        "service_30qva3w",
        templateId,
        templateParams,
        "O_e0xLYooqSDsjjl1"
      );
      setStatus("Notification email sent successfully.");
    } catch (err) {
      setError("Failed to send email notification.");
      console.error("EmailJS error:", err);
    }
  };

  // SMS sending function using Fast2SMS API
  const sendSMSNotification = async (phoneNumber, smsMessage) => {
    const options = {
      method: "POST",
      headers: {
        "authorization": "GhpPvN9oldVbZiaQWf3EqJSUIMnDY0tCg8kBT2cXLOu1RHyjesJg9uRUHKYnV7mriDcG8beO5tz01N2X",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender_id: "FSTSMS",
        message: smsMessage,
        language: "english",
        route: "p",
        numbers: phoneNumber
      })
    };

    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", options);
      const data = await response.json();
      console.log("SMS Response:", data);
    } catch (error) {
      console.error("SMS Error:", error);
    }
  };

  // Handle Doctor's Update Submission (Step 1)
  const handleDoctorUpdate = () => {
    if (!sickReason.trim()) {
      setError("Please enter the reason for sickness.");
      return;
    }
    if (!severity.trim()) {
      setError("Please select a severity level.");
      return;
    }

    setError("");
    const message = `Student ${user.name} has been reported sick.
Reason: ${sickReason}
Additional Symptoms: ${additionalSymptoms || "None"}
Severity: ${severity}`;

    const templateParams = {
      name: user.name,
      email: user.email,
      phone: user.phone || "Not Provided",
      message,
      coordinator_name: coordinatorName,
      coordinator_email: coordinatorEmail,
      class_name: className,
    };

    sendEmail("template_xl3epgh", templateParams);
    setStatus("Sick report submitted. Moving to leave report...");
    setCurrentStep("leaveReport");
  };

  // Handle Leave Report Submission (Step 2)
  const handleLeaveReport = async () => {
    if (!leaveReason.trim()) {
      setError("Please enter the reason for leaving.");
      return;
    }
    if (!expectedReturn.trim()) {
      setError("Please enter the expected return time.");
      return;
    }
    if (!confirmLeave) {
      setError("Please confirm that you are leaving campus.");
      return;
    }
    if (!parentEmail.trim()) {
      setError("Please enter your parent's email.");
      return;
    }

    setError("");
    const message = `Student ${user.name} is leaving campus.
Reason: ${leaveReason}
Expected Return Time: ${expectedReturn}`;

    const templateParams = {
      name: user.name,
      email: user.email,
      phone: user.phone || "Not Provided",
      message,
      parent_email: parentEmail,
      parent_phone: parentPhone,
      additional_comments: additionalComments,
    };

    await sendEmail("template_xl3epgh", templateParams);

    try {
      await emailjs.send(
        "service_hul77eq",
        "template_hct75om",
        templateParams,
        "bcj7VY3u7HG4cShur"
      );
      console.log("Second email sent successfully.");
    } catch (err) {
      console.error("Error sending second email:", err);
    }

    setStatus("Leave report submitted successfully.");

    if (user.phone) {
      const smsMessage = `Hi ${user.name}, your leave report has been submitted successfully. Safe journey!`;
      sendSMSNotification(user.phone, smsMessage);
    }
  };

  return (
    // The outer div now uses "min-h-screen bg-gray-900" to enforce a full-height dark background.
    <div className="min-h-screen bg-gray-900 dark">
      <main className="max-w-4xl mx-auto p-6">
        <div className="mb-8 space-y-4">
          <h2 className="text-4xl font-bold text-blue-500">
            Health & Leave Notifications
          </h2>
          <p className="text-slate-300">
            Submit your health status and leave requests in two simple steps
          </p>
        </div>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="doctorUpdate"
              className="data-[state=active]:bg-violet-900 data-[state=active]:text-white"
            >
              Step 1: Doctor's Update
            </TabsTrigger>
            <TabsTrigger
              value="leaveReport"
              className="data-[state=active]:bg-violet-900 data-[state=active]:text-white"
            >
              Step 2: Leave Report
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctorUpdate" currentValue={currentStep}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Doctor's Update
                  <Badge variant="secondary" className="ml-2">
                    Step 1 of 2
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Sickness*</label>
                  <textarea
                    className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Please describe your symptoms..."
                    value={sickReason}
                    onChange={(e) => setSickReason(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Symptoms</label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Any other symptoms you're experiencing..."
                    value={additionalSymptoms}
                    onChange={(e) => setAdditionalSymptoms(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Severity*</label>
                  <select
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                  >
                    <option value="">Select severity level</option>
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Coordinator Name</label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                      placeholder="Enter coordinator's name"
                      value={coordinatorName}
                      onChange={(e) => setCoordinatorName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Coordinator Email</label>
                    <input
                      type="email"
                      className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                      placeholder="Enter coordinator's email"
                      value={coordinatorEmail}
                      onChange={(e) => setCoordinatorEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Class Name</label>
                  <input
                    type="text"
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Enter your class name"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  />
                </div>

                <button
                  className="w-full h-12 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  onClick={handleDoctorUpdate}
                >
                  Continue to Leave Report
                </button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaveReport" currentValue={currentStep}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Leave Report
                  <Badge variant="secondary" className="ml-2">
                    Step 2 of 2
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for Leaving Campus*</label>
                  <textarea
                    className="w-full min-h-[100px] p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Why do you need to leave campus?"
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Expected Return Date*</label>
                  <input
                    type="date"
                    min={minDate}
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Parent's Email*</label>
                    <input
                      type="email"
                      className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                      placeholder="Enter parent's email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Parent's Phone</label>
                    <input
                      type="tel"
                      className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                      placeholder="Enter parent's phone number"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Additional Comments</label>
                  <textarea
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    placeholder="Any additional information..."
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 p-4 bg-slate-50 rounded-lg dark:bg-slate-800">
                  <input
                    type="checkbox"
                    id="confirmLeave"
                    checked={confirmLeave}
                    onChange={(e) => setConfirmLeave(e.target.checked)}
                    className="w-4 h-4 text-violet-900 rounded border-slate-300"
                  />
                  <label htmlFor="confirmLeave" className="text-sm font-medium">
                    I confirm that I am leaving campus
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 h-12 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    onClick={() => setCurrentStep("doctorUpdate")}
                  >
                    Back to Doctor's Update
                  </button>
                  <button
                    className="flex-1 h-12 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    onClick={handleLeaveReport}
                  >
                    Submit Leave Report
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          {error ? (
            <ErrorStrip error={error} />
          ) : (
            status && <p className="text-green-600">{status}</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HealthLeaveNotifications;
