import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../Utils/Redux/loadingSlice";
import { darkMode } from "../Utils/Redux/darkModeSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dark = useSelector(darkMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    if (!data.email || !data.password) {
      toast.error("All fields are required!");
      return;
    }

    try {
      dispatch(setLoader(30));
      const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      dispatch(setLoader(70));
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Login failed");
      } else {
        // Save token and user data
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user)); // if your backend sends user

        toast.success("Login successful!");
        navigate("/"); // ✅ Update this route as per your project
      }
    } catch (error) {
      toast.error("Server error. Try again later.");
    }

    dispatch(setLoader(100));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setLoader(40));
      setTimeout(() => navigate("/dashboard"), 800);
      dispatch(setLoader(100));
    }
  }, [navigate, dispatch]);

  return (
    <div className="flex justify-center flex-col bg-inherit py-11 w-[90%] md:w-[70%] shadow-[0_0_40px_5px_rgba(192,132,252,0.7)] rounded-lg sm:rounded-md">
      <div className="flex justify-center items-center">
        <p className={`${dark ? "text-white" : "text-black"} text-4xl font-bold`}>
          Shortify <span className="text-black bg-purple-400 px-2 py-[2px] rounded-[4px]">hub</span>
        </p>
      </div>

      <div className="flex justify-center my-2 sm:my-4">
        <p className={`${dark ? "text-white" : "text-black"} text-lg font-semibold sm:text-2xl`}>
          Login to your account
        </p>
      </div>

      <form className="flex p-7 gap-9 flex-col items-center" onSubmit={handleSubmit(handleLogin)}>
        <div className="w-full flex flex-col items-center gap-1">
          <input
            className={`font-medium ${dark ? "text-white" : "text-black"} sm:text-lg h-[4vh] pl-2 focus:outline-none w-[90%] sm:w-[70%] bg-inherit border border-purple-400 shadow shadow-purple-300 p-5 rounded-sm`}
            placeholder="Your Email Address"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>

        <div className="w-full flex flex-col items-center gap-1">
          <input
            className={`font-medium ${dark ? "text-white" : "text-black"} sm:text-lg h-[4vh] pl-2 focus:outline-none w-[90%] sm:w-[70%] bg-inherit border border-purple-400 shadow shadow-purple-300 p-5 rounded-sm`}
            type="password"
            placeholder="Your Password"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="bg-purple-400 sm:text-lg md:text-xl hover:bg-purple-500 px-5 font-[700] font-sans sm:w-[20%] rounded-md py-2"
        >
          Login
        </button>

        <Link to="/signup" className={`${dark ? "text-white" : "text-black"} font-semibold`}>
          Don&#39;t have an account yet?{" "}
          <span className="text-purple-400 font-bold cursor-pointer hover:underline">Sign Up</span>
        </Link>
      </form>
    </div>
  );
}

export default Login;
