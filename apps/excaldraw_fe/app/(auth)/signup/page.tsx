"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
}

interface XStatus {
  status?: number;
  message?: string;
}

function page() {
  // Local UI state for async submit (you will wire real logic later)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverState, setServerState] = useState<XStatus | null>(null);
  const [hasInputChanged, setHasInputChanged] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<SignupFormData>({
    mode: "onChange",
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignupFormData) => {
    // console.log("Signupformdata:", data);
    // const xData = {
    //   name: data.fullName,
    //   email: data.email,
    //   password: data.password,
    // };
    // setHasInputChanged(false);
    // setIsSubmitting(true);
    // setServerState(null);
    // try {
    //   const res: { status: number; message?: string } = await smartFetch(
    //     SIGNUP_EP,
    //     {
    //       method: "POST",
    //       body: xData,
    //     }
    //   );
    //   if (res && res.status === 200) {
    //     setServerState({
    //       status: res.status,
    //       message: res.message || "Signup successful",
    //     });
    //     reset();
    //     setTimeout(() => {
    //       router.push("/otp");
    //     }, 2000);
    //   } else {
    //     setServerState({
    //       status: res.status,
    //       message: res.message || "Signup failed",
    //     });
    //   }
    // } catch (e) {
    //   setServerState({ status: 500, message: "Something went wrong" });
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  // Any input change hides prior server message until submit
  const handleFieldChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!hasInputChanged) setHasInputChanged(true);
    const fullName =
      e.target.id === "fullName" ? e.target.value : watch("fullName", "");
    const email = e.target.id === "email" ? e.target.value : watch("email", "");
    const password =
      e.target.id === "password" ? e.target.value : watch("password", "");
    const disableButton = !fullName || !email || !password;

    // setDisableButton(disableButton); --- IGNORE ---
    setDisableButton(disableButton);
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md px-8 py-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Sign up to prepare, practice, and perform.
          </h2>
          {serverState && !hasInputChanged && (
            <div className="mb-6">
              {serverState.status === 200 ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <p className="text-green-800 font-medium">
                    {serverState.message || "Success"}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                  <p className="text-red-800 font-medium">
                    {serverState.message ||
                      "An error occurred. Please try again."}
                  </p>
                </div>
              )}
            </div>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                placeholder="Enter your full name"
                aria-invalid={!!errors.fullName || undefined}
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                })}
                onChange={handleFieldChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors aria-invalid:border-destructive aria-invalid:ring-destructive/20"
              />
              {errors.fullName && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                aria-invalid={!!errors.email || undefined}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                onChange={handleFieldChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors aria-invalid:border-destructive aria-invalid:ring-destructive/20"
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  aria-invalid={!!errors.password || undefined}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  onChange={handleFieldChange}
                  className="w-full pr-12 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-colors aria-invalid:border-destructive aria-invalid:ring-destructive/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={disableButton || isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Signing up..." : "Sign up"}
              </button>
            </div>

            {/* Sign in link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default page;
