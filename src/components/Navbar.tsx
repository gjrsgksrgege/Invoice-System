import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, setMode } from "../store/BlogSlice";
import BlogForm from "./BlogForm";
import type { RootState } from "../store/store";
import { supabase } from "../utils/Supabase";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const mode = useSelector((state: RootState) => state.blog.mode);
  const dispatch = useDispatch();
  const panelRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowCreate(mode === "create");

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (panelRef.current && !panelRef.current.contains(target)) {
        dispatch(setMode(null));
      }
    };

    if (mode === "create") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mode, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (profileRef.current && !profileRef.current.contains(target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout failed:", error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-80 bg-[#fff] border border-[#E0E0E0]">
        <nav className="grid grid-cols-2 items-center px-8 w-full h-full gap-4 relative">
          <div className="uppercase tracking-widest cursor-pointer">Logo</div>
          <div className="justify-self-end relative">
            <div className="flex items-center">
              <div className="border border-[#E0E0E0] bg rounded-4xl">
                <button
                  onClick={() => dispatch(createBlog())}
                  className="px-2 md:px-4 py-1 md:py-2 rounded cursor-pointer hover:rounded-full hover:text-white hover:bg-black transition-all flex items-center gap-2 text-xs font-[500]"
                >
                  <div className="flex items-center">
                    <i className="fa-regular fa-plus text-[10px]"></i>
                  </div>
                  <p className="text-[10px] md:text-[12px]">Create Blog</p>
                </button>
              </div>
              <div>
                <button
                  className="px-4 py-3 cursor-pointer rounded transition-all"
                  onClick={() => setShowProfile((prev) => !prev)}
                >
                  <i className="fa-regular fa-user"></i>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Create Blog Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 left-0 max-w-xl px-12 py-10 h-screen bg-white border border-[#E0E0E0] transform transition-all duration-300 ease-out ${
          showCreate ? "translate-x-0 z-90" : "-translate-x-full z-80"
        }`}
      >
        <div className="w-full">
          <BlogForm mode={mode as "create" | "edit"} />
        </div>
      </div>

      {/* Profile Dropdown Panel */}
      <div
        ref={profileRef}
        className={`fixed right-0 top-[35px] w-[250px] bg-[#fff] z-50 border py-4 border-[#E0E0E0] shadow-md transform transition-all duration-300 ease-out ${
          showProfile ? "translate-y-0 z-60" : "-translate-y-full z-50"
        }`}
      >
        <ul className="flex flex-col text-sm font-normal">
          <li className="px-6 py-2 hover:bg-[#f3f3f3] hover:font-semibold cursor-pointer">
            My Account
          </li>
          <li className="px-6 py-2 hover:bg-[#f3f3f3] hover:font-semibold cursor-pointer">
            Settings
          </li>
          <li
            className="px-6 py-2 hover:bg-[#f3f3f3] hover:font-semibold cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
