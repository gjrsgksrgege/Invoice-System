// features/user/userSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface Item {
  id: string;
  inv_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface BlogPost {
  id: number;
  inv_id: string;
  name: string;
  user_id: string;
  total_amount: number;
  created_at: Date;
  items_list?: Item[];
}

export interface Product {
  name: string;
  price: number;
}

interface BlogState {
  blogs: BlogPost[];
  products: Product[];
  mode: "create" | "edit" | "delete" | null;
  loading: boolean;
  editBlog: BlogPost | null;
  deleteBlog: BlogPost | null;
  blogSubmitted: boolean;
}

const initialState: BlogState = {
  blogs: [],
  products: [
    { name: "Speaker", price: 1200 },
    { name: "Mouse", price: 800 },
    { name: "Keyboard", price: 1450 },
  ],
  mode: null,
  loading: false,
  editBlog: null,
  deleteBlog: null,
  blogSubmitted: false,
};

const userSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    updateProduct: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof Product;
        value: string | number;
      }>
    ) => {
      const { index, field, value } = action.payload;
      state.products[index][field] = value as never;
    },
    createBlog: (state) => {
      state.mode = "create";
    },
    editBlog: (state, action: PayloadAction<BlogPost>) => {
      state.mode = "edit";
      state.editBlog = action.payload;
    },
    deleteBlog: (state, action: PayloadAction<BlogPost>) => {
      state.mode = "delete";
      state.deleteBlog = action.payload;
    },
    submitBlog(state) {
      state.blogSubmitted = !state.blogSubmitted; // toggle to trigger useEffect
      state.mode = null; // close panel after submission
      state.editBlog = null;
      state.deleteBlog = null;
    },
    setMode: (state, action: PayloadAction<"create" | "edit" | null>) => {
      state.mode = action.payload;
    }, 
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }, 
    setBlogs: (state, action: PayloadAction<BlogPost[]>) => {
      state.blogs = action.payload;
    },
}
});

export const { updateProduct, createBlog, editBlog, deleteBlog, submitBlog, setMode, setLoading, setBlogs } = userSlice.actions;
export default userSlice.reducer;
