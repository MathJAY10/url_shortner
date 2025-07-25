import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setLoader } from '../Utils/Redux/loadingSlice';
import { darkMode } from '../Utils/Redux/darkModeSlice';

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark = useSelector(darkMode);

  const handleSignUp = async (inputData) => {
    try {
      dispatch(setLoader(30));
      const res = await fetch(`${import.meta.env.VITE_BASE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      dispatch(setLoader(60));
      const parsedRes = await res.json();
      console.log("🚀 Signup response:", parsedRes); 
      console.log("✅ res.ok:", res.ok);
      console.log("✅ parsedRes.token:", parsedRes.token);
      console.log("✅ parsedRes:", parsedRes);
      if (!res.ok || !parsedRes.token) {
        
        
        toast.error(parsedRes.error || parsedRes.msg || "Signup failed.");

      } else {
        localStorage.setItem("token", parsedRes.token);
        toast.success("Signup successful!");
        navigate('/');
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong. Try again.");
    } finally {
      dispatch(setLoader(100));
    }
  };

  return (
    <div className="flex justify-center flex-col bg-inherit py-11 sm:py-16 w-[90%] md:w-[70%] shadow-[0_0_40px_5px_rgba(192,132,252,0.7)] rounded-lg sm:rounded-md">
      <div className="flex main_logo justify-center items-center">
        <p className={`${isDark ? "text-white" : "text-black"} text-4xl font-bold`}>
          Shortify <span className="text-black bg-purple-400 px-2 py-[2px] rounded-[4px]">hub</span>
        </p>
      </div>

      <div className="flex justify-center my-2 sm:my-4">
        <p className={`${isDark ? "text-white" : "text-black"} text-lg font-semibold font-sans sm:text-2xl`}>
          Create new account
        </p>
      </div>

      <form onSubmit={handleSubmit(handleSignUp)} className="flex p-7 gap-9 flex-col items-center">
        {/* Name */}
        <div className="flex flex-col items-center gap-1 w-full">
          <input
            className={`font-medium ${isDark ? "text-white" : "text-black"} sm:text-lg h-[4vh] font-sans pl-2 w-[90%] sm:w-[70%] bg-inherit border border-purple-400 shadow shadow-purple-300 p-5 rounded-sm focus:outline-none`}
            placeholder="Your Name"
            type="text"
            {...register("name", {
              required: "Name is required",
              minLength: { value: 3, message: "Minimum length for name is 3" },
            })}
          />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col items-center gap-1 w-full">
          <input
            className={`font-medium ${isDark ? "text-white" : "text-black"} sm:text-lg h-[4vh] font-sans pl-2 w-[90%] sm:w-[70%] bg-inherit border border-purple-400 shadow shadow-purple-300 p-5 rounded-sm focus:outline-none`}
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

        {/* Password */}
        <div className="flex flex-col items-center gap-1 w-full">
          <input
            className={`font-medium ${isDark ? "text-white" : "text-black"} sm:text-lg h-[4vh] font-sans pl-2 w-[90%] sm:w-[70%] bg-inherit border border-purple-400 shadow shadow-purple-300 p-5 rounded-sm focus:outline-none`}
            placeholder="Your Password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 5, message: "Minimum length is 5" },
            })}
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>

        <button
          className="bg-purple-400 text-base md:text-lg hover:bg-purple-500 px-5 font-bold font-sans sm:w-[23%] rounded-md py-2"
          type="submit"
        >
          Sign Up
        </button>

        <p className={`${isDark ? "text-white" : "text-black"} font-semibold`}>
          Already have an account?{" "}
          <Link to="/login">
            <span className="text-purple-400 font-bold cursor-pointer hover:underline">Log in</span>
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
