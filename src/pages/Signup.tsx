import lavenderImg from "../assets/Lavender.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../utils/Supabase";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error.message);
      setErrorMsg(error.message || "Something went wrong");
      return;
    }

    const user = data?.user;
    if (user) {
      await supabase.from("profiles").insert({
        id: user.id,
      });
    }

    setErrorMsg("");
    navigate("/", {
      state: { signupSuccess: true },
    });
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="h-full md:flex flex-col md:flex-row w-full overflow-hidden">
        {/* Left side */}
        <div className="hidden md:block w-full md:w-[60%] relative order-2">
          <img
            src={lavenderImg}
            alt="Login Visual"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute text-white inset-0 bg-opacity-30 flex flex-col justify-end p-6">
            <div className="text-xl">
              <p>Capturing Moments,</p>
              <p>Creating Memories</p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full h-full md:w-[40%] p-4 md:p-10 border border-[#E0E0E0]">
          {errorMsg && (
            <div className="text-red-500 text-sm mb-4">{errorMsg}</div>
          )}

          <form
            className="h-full p-12 flex flex-col justify-around"
            onSubmit={handleSignup}
          >
            <div>
              <h2 className="text-[27px] md:text-[30px] mb-2">
                Create an account
              </h2>
              <div className="mb-6 text-sm font-normal gap-2 flex flex-row items-center">
                <p>Already have an account?</p>
                <Link
                  to="/"
                  className="text-[#494848] font-semibold hover:underline"
                >
                  Log in
                </Link>
              </div>
            </div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#fff] border border-gray-400 focus:outline-none placeholder:text-gray-400 focus:placeholder:text-[#E0E0E0] focus:ring-2 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#fff] border border-gray-400 focus:outline-none placeholder:text-gray-400 focus:placeholder:text-[#E0E0E0] focus:ring-2 focus:ring-black"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-[#fff] border border-gray-400 focus:outline-none placeholder:text-gray-400 focus:placeholder:text-[#E0E0E0] focus:ring-2 focus:ring-black"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                minLength={6}
                maxLength={25}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#fff] border border-gray-400 focus:outline-none placeholder:text-gray-400 focus:placeholder:text-[#E0E0E0] focus:ring-2 focus:ring-black"
              />
              <span
                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <i className="fa-regular fa-eye"></i>
              </span>
            </div>

            <label className="flex items-center font-normal text-sm gap-2">
              <input type="checkbox" className="text-[#494848]" required />
              <span className="text-[#494848] text-[12px] md:text-[14px]">
                I agree to the
              </span>
              <a
                href="#"
                className="text-[#494848] font-semibold hover:underline text-[12px] md:text-[14px]"
              >
                Terms & Conditions
              </a>
            </label>

            <button
              type="submit"
              className="w-full py-3 text-white rounded bg-black hover:bg-gray-800 font-medium transition tracking-widest"
            >
              Create account
            </button>

            <div className="flex items-center gap-4 text-sm mt-4 font-normal">
              <div className="flex-grow h-px bg-gray-600"></div>
              <span>Or register with</span>
              <div className="flex-grow h-px bg-gray-600"></div>
            </div>

            <div className="flex gap-4 mt-2">
              <button className="w-full py-3 border border-gray-400 rounded flex items-center justify-center gap-2 cursor-pointer">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  className="w-5 h-5"
                />
                Google
              </button>
              <button className="w-full py-3 bg-black text-white rounded flex items-center justify-center gap-2 cursor-pointer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Apple_logo_white.svg/1724px-Apple_logo_white.svg.png"
                  className="w-4.3 h-5 text-"
                />
                Apple
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
