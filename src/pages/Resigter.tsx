import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    orgName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.orgName) {
      toast.error("All fields are required");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      login(data.data.token, data.data.user);
      toast.success(`Welcome, ${data.data.user.name}!`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        {/* Brand */}
        <div className="mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#7364FF] flex items-center justify-center mb-4">
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Create your workspace
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Set up your organization and get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Organization name
            </label>
            <input
              name="orgName"
              value={form.orgName}
              onChange={handleChange}
              placeholder="Acme Corp"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Your name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@acme.com"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="input"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 mt-1 text-sm font-medium rounded-lg disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="spinner" /> Creating workspace...
              </>
            ) : (
              "Create workspace"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-[#7364FF] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
