import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import backgroundImage from "../assets/background.jpg";
import haloLogo from "../assets/haloLogo.svg";

const UserLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, loginWithGoogle, error, clearError, isLoading } =
    useAuth();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsSubmitting(true);
      setLocalError(null);
      clearError();
      try {
        await loginWithGoogle(tokenResponse.access_token);
      } catch (err) {
        console.error("Google authentication error:", err);
        setLocalError("Google Sign In failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    onError: () => {
      setLocalError("Google Sign In failed. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError("Please fill in all required fields");
      return;
    }

    if (!isLogin && password.length < 8) {
      setLocalError("Password must be at least 8 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ email, password, name: name || undefined });
      }
    } catch (err) {
      console.error("Authentication error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setLocalError(null);
    clearError();
    setEmail("");
    setPassword("");
    setName("");
  };

  const displayError = localError || error;

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="absolute inset-0 bg-white/25 z-0"></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/50 rounded-3xl shadow-xl backdrop-blur-sm outline outline-1 outline-offset-[-0.0625rem] outline-white/50 p-8">
          <div className="flex flex-col items-center mb-8 overflow-x overflow-y">
            <img
              src={haloLogo}
              alt="Logo"
              className="w-[8rem] h-[8rem] overflow-x overflow-y"
            />
            <div className="text-black text-4xl font-sf-pro font-bold mt-2">
              Halo
            </div>
            <div className="text-black/60 text-lg font-sf-pro mt-1">
              {isLogin ? "Welcome back" : "Create your account"}
            </div>
          </div>

          {displayError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
              <p className="text-red-900 text-sm font-sf-pro font-medium">
                {displayError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-black font-sf-pro font-medium mb-2"
                >
                  Name (Optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none text-black font-sf-pro"
                  placeholder="Type your name"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-black font-sf-pro font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none text-black font-sf-pro"
                placeholder="Type your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-black font-sf-pro font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none text-black font-sf-pro"
                placeholder="Type your password"
                required
              />
              {!isLogin && (
                <p className="text-black/50 text-xs font-sf-pro mt-1">
                  Must be at least 8 characters long
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 bg-sky-500/50 rounded-xl border border-white/50 text-black font-sf-pro font-bold text-lg shadow-xl"
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white/50"></div>
            <span className="px-4 text-black/60 font-sf-pro text-sm">or</span>
            <div className="flex-1 border-t border-white/50"></div>
          </div>

          <button
            type="button"
            disabled={isSubmitting || isLoading}
            className="w-full py-3 bg-white/50 rounded-xl border border-white/50 text-black font-sf-pro font-medium shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleGoogleLogin()}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isSubmitting || isLoading
              ? "Processing..."
              : "Continue with Google"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-black/60 font-sf-pro">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-sky-600 font-semibold hover:text-sky-700 transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
