import { useState } from "react";
import axios from "../../config/api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorStrip from "../ErrorStrip";
import { Check, X } from "lucide-react";

const StudentForm = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState({
    name: "",
    email: "",
    course: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSymbol: false,
  });

  const handleFormChange = (e) => {
    setStudent({
      ...student,
      [e.target.id]: e.target.value,
    });

    if (e.target.id === 'email') {
      validateEmail(e.target.value);
    }
    if (e.target.id === 'password') {
      validatePassword(e.target.value);
    }
    
    setValidationErrors({
      ...validationErrors,
      [e.target.id]: "",
    });
  };

  const validateEmail = (email) => {
    if (!email.endsWith('@vit.edu')) {
      setValidationErrors({
        ...validationErrors,
        email: "Please use your VIT email address (@vit.edu)",
      });
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    const criteria = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    setPasswordCriteria(criteria);

    if (!Object.values(criteria).every(Boolean)) {
      let errorMessage = "Password must contain:";
      if (!criteria.minLength) errorMessage += " at least 8 characters,";
      if (!criteria.hasUpperCase) errorMessage += " 1 uppercase letter,";
      if (!criteria.hasNumber) errorMessage += " 1 number,";
      if (!criteria.hasSymbol) errorMessage += " 1 special character,";
      errorMessage = errorMessage.slice(0, -1);

      setValidationErrors({
        ...validationErrors,
        password: errorMessage,
      });
      return false;
    }
    return true;
  };

  const validateForm = () => {
    const errors = {};
    if (!validateEmail(student.email)) {
      errors.email = "Please use your VIT email address (@vit.edu)";
    }
    if (!validatePassword(student.password)) {
      errors.password = validationErrors.password;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addStudent = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const reqData = JSON.stringify(student);
      const response = await axios.post("student", reqData);
      navigate("/");
      toast.success(response.data.message);
    } catch (err) {
      setError(err);
    }
  };

  const RequirementIndicator = ({ met, text }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={met ? "text-green-600" : "text-red-600"}>
        {text}
      </span>
    </div>
  );

  return (
    <form className="scrollWidth w-full animate-fadeIn font-medium tracking-wide accent-violet-600">
      <label className="block" htmlFor="name">
        Name:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
        type="text"
        required
        id="name"
        value={student.name}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="email">
        Email: <span className="text-sm text-slate-500">(@vit.edu required)</span>
      </label>
      <input
        className={`mb-1 block h-10 w-full rounded-md border-[1.5px] border-solid ${
          validationErrors.email ? 'border-red-500' : 'border-slate-400'
        } p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400`}
        type="email"
        required
        id="email"
        value={student.email}
        onChange={(e) => handleFormChange(e)}
      />
      {validationErrors.email && (
        <p className="mb-4 text-sm text-red-500">{validationErrors.email}</p>
      )}
      {!validationErrors.email && <div className="mb-4" />}
      <label className="block" htmlFor="course">
        Course:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
        type="text"
        required
        id="course"
        value={student.course}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="username">
        Username:
      </label>
      <input
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-slate-400 p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400"
        type="text"
        id="username"
        required
        value={student.username}
        onChange={(e) => handleFormChange(e)}
      />
      <label className="block" htmlFor="password">
        Password:
      </label>
      <input
        className={`mb-2 block h-10 w-full rounded-md border-[1.5px] border-solid ${
          validationErrors.password ? 'border-red-500' : 'border-slate-400'
        } p-1 pl-2 outline-none selection:border-slate-200 focus:border-violet-900 dark:border-slate-200 dark:caret-inherit dark:focus:border-violet-400 dark:active:border-violet-400`}
        type="password"
        id="password"
        value={student.password}
        onChange={(e) => handleFormChange(e)}
        required
      />
      
      <div className="mb-4 rounded-md bg-slate-50 p-3 dark:bg-slate-800">
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Password Requirements:
        </p>
        <div className="space-y-2">
          <RequirementIndicator
            met={passwordCriteria.minLength}
            text="At least 8 characters"
          />
          <RequirementIndicator
            met={passwordCriteria.hasUpperCase}
            text="One uppercase letter"
          />
          <RequirementIndicator
            met={passwordCriteria.hasNumber}
            text="One number"
          />
          <RequirementIndicator
            met={passwordCriteria.hasSymbol}
            text="One special character"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mb-4 block h-10 w-full rounded-md border-[1.5px] border-solid border-violet-900 bg-slate-800 p-1 font-bold tracking-wide text-slate-200 hover:bg-violet-900 focus:bg-violet-900 dark:border-violet-300 dark:bg-violet-600 dark:text-slate-50 dark:hover:bg-slate-900"
        onClick={(e) => addStudent(e)}
      >
        Register
      </button>
      {error ? <ErrorStrip error={error} /> : ""}
    </form>
  );
};

export default StudentForm;