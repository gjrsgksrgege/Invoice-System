import lavenderImg from "../assets/Lavender.jpeg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../utils/Supabase";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase error:", error);
      setErrorMsg(error.message || "Something went wrong");
      return;
    }

    const user = data?.user;
    if (user) {
      await supabase.from("profiles").insert({
        id: user.id,
      });
    }

    // Success
    setErrorMsg(""); // clear errors
    navigate("/admin"); // or wherever you're heading
  };

  const [showSuccess, setShowSuccess] = useState(location.state?.signupSuccess);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showSuccess) {
      // Start animation IN
      setVisible(true);

      // Slide OUT after 3s
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      // Fully remove after animation ends
      const removeTimer = setTimeout(() => {
        setShowSuccess(false);
      }, 3500);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [showSuccess]);

  return (
    <div className="h-screen w-full flex items-center justify-center">
      {showSuccess && (
        <div
          className={`fixed top-5 right-5 transform z-50 transition-all duration-500 ease-out ${
            visible ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"
          }`}
        >
          <div className="text-sm bg-[#16171B] border border-gray-600 text-white px-8 py-4 rounded-xl shadow-lg flex flex-row justify-center items-start gap-3">
            <i className="fa-solid fa-circle-check mt-[1.5px] text-[17px]"></i>
            <p className="flex flex-col justify-center">
              <span className="mb-1 items-start">
                Account created successfully!{" "}
              </span>
              <span>
                You can <span className="font-semibold">log in</span> now.
              </span>
            </p>
          </div>
        </div>
      )}

      <div className="h-full md:flex flex-col md:flex-row w-full overflow-hidden">
        {/* left side */}
        <div className="hidden md:block w-full md:w-[60%] relative order-2">
          <img
            src={lavenderImg}
            alt="Login Visual"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute text-white inset-0 bg-opacity-30 flex flex-col justify-end p-6">
            <div className=" text-xl">
              <p>Capturing Moments,</p>
              <p>Creating Memories</p>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="w-full h-full md:w-[40%] p-4 md:p-10 border border-[#E0E0E0]">
          <div className="h-full">
            <form
              onSubmit={handleLogin}
              className="h-full p-12 flex flex-col justify-around"
              autoComplete="off"
            >
              <div>
                <h2 className="text-3xl mb-2">Welcome Back!</h2>
                <div className="mb-6 text-sm font-normal gap-2 flex flex-row items-center">
                  <p>Don't have an account</p>
                  <Link
                    to="/signup"
                    className="text-[#494848] font-semibold hover:underline"
                  >
                    Register
                  </Link>
                </div>
              </div>
              {errorMsg && (
                <div className="text-red-400 text-sm">{errorMsg}</div>
              )}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 rounded bg-[#fff] border border-gray-400 focus:outline-none placeholder:text-gray-400 focus:placeholder:text-[#E0E0E0] focus:ring-2 focus:ring-black"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded bg-[#fff] border border-gray-400 focus:outline-none placeholder:text-gray-400 focus:placeholder:text-[#E0E0E0] focus:ring-2 focus:ring-black"
                />
                <span
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <i className="fa-regular fa-eye"></i>
                </span>
              </div>

              <label className="flex items-center justify-between font-normal text-sm gap-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="text-[#494848]" />
                  <span className="text-[#494848] text-[12px] md:text-[14px]">
                    Remember me?
                  </span>
                </div>
                <a
                  href="#"
                  className="text-[#494848] text-[12px] md:text-[14px] hover:underline"
                >
                  Forgot Password?
                </a>
              </label>

              <button
                type="submit"
                className="w-full py-3 text-white rounded bg-black hover:bg-gray-800 font-medium transition tracking-widest"
              >
                Login
              </button>

              <div className="flex items-center gap-4 text-sm mt-4 font-normal">
                <div className="flex-grow h-px bg-gray-600"></div>
                <span>Or login with</span>
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
    </div>
  );
};

export default Login;
