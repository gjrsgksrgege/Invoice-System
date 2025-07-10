import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setMode,
  editBlog,
  deleteBlog as setDeleteBlog,
  submitBlog,
  setLoading,
  setBlogs,
} from "../store/BlogSlice";
import { supabase } from "../utils/Supabase";
import type { RootState } from "../store/store";
import BlogForm from "../components/BlogForm";

const Admin = () => {
  const { blogs, loading, mode, deleteBlog, blogSubmitted } = useSelector(
    (state: RootState) => state.blog
  );
  const dispatch = useDispatch();
  const panelRef = useRef<HTMLDivElement>(null);
  const [showCreate, setShowCreate] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 4;

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  // End of Pagination state

  useEffect(() => {
    setShowCreate(mode === "edit");

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        dispatch(setMode(null));
      }
    };

    if (mode === "edit") {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mode, dispatch]);

  useEffect(() => {
    const checkBlogs = async () => {
      dispatch(setLoading(true));

      const { data, error } = await supabase
        .from("invoice_list")
        .select("*")
        .order("created_at", { ascending: false });

      console.log({ data });

      if (!error && data) {
        dispatch(setBlogs(data));
      }

      dispatch(setLoading(false));
    };

    checkBlogs();
  }, [dispatch, blogSubmitted]);

  useEffect(() => {
    const performDelete = async () => {
      if (mode === "delete" && deleteBlog) {
        const { error: itemsError } = await supabase
          .from("items_list")
          .delete()
          .eq("inv_id", deleteBlog.inv_id);

        if (itemsError) {
          console.error("Failed to delete items:", itemsError.message);
          return;
        }

        const { error: invoiceError } = await supabase
          .from("invoice_list")
          .delete()
          .eq("id", deleteBlog.id);

        if (invoiceError) {
          console.error("Failed to delete invoice:", invoiceError.message);
        } else {
          console.log("Deleted invoice:", deleteBlog.inv_id);
          dispatch(submitBlog());
        }
      }
    };

    performDelete();
  }, [mode, deleteBlog, dispatch]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col p-6 max-w-6xl mx-auto pt-16">
        <h2 className="mb-4">List of Invoice</h2>

        {loading ? (
          <p>Loading...</p>
        ) : blogs.length === 0 ? (
          <div className="text-center w-full max-w-2xl mx-auto font-normal py-10 border rounded-lg border-[#E0E0E0]">
            This table is empty.
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto flex flex-col flex-grow">
            <div className="space-y-6">
              {currentBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className="w-full flex flex-row rounded-md shadow-lg border border-gray-200"
                >
                  <div className="flex flex-col space-y-3 p-4 w-full">
                    <div className="flex items-center justify-between">
                      <p>{blog.inv_id}</p>
                      <div className="flex gap-5">
                        <button
                          className="cursor-pointer"
                          onClick={() => {
                            console.log("Editing:", blog);
                            dispatch(editBlog(blog));
                          }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                        <button
                          className="cursor-pointer"
                          onClick={() => dispatch(setDeleteBlog(blog))}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                    <p className="font-normal">{blog.name}</p>
                    <div className="flex justify-start">
                      <p className="bg-gray-900 px-4 py-2 rounded-xl text-[12px] text-white">
                        P {blog.total_amount}
                      </p>
                    </div>
                    <div className="flex justify-end text-[#6C6C72] text-xs">
                      <div className="bg-[#f3f3f3] p-3 rounded-md">
                        {new Date(blog.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {blogs.length > blogsPerPage && (
              <div className="flex justify-between mt-6 gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className="px-3 py-1 border rounded disabled:opacity-30"
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="px-4 py-1">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="px-3 py-1 border rounded disabled:opacity-30"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
    </>
  );
};

export default Admin;
