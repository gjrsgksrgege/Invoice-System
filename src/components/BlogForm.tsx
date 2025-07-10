import React, { useState, useEffect } from "react";
import { supabase } from "../utils/Supabase";
import { useDispatch, useSelector } from "react-redux";
import { submitBlog, setMode } from "../store/BlogSlice";
import type { RootState } from "../store/store";

interface Item {
  id?: string;
  inv_id: string;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface BlogFormProps {
  mode: "create" | "edit" | "delete";
}

const BlogForm: React.FC<BlogFormProps> = ({ mode }) => {
  const dispatch = useDispatch();
  const editBlog = useSelector((state: RootState) => state.blog.editBlog);
  const products = useSelector((state: RootState) => state.blog.products);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [formProducts, setFormProducts] = useState<Item[]>([]);

  const [inv_id, setInv] = useState("");
  const [name, setName] = useState("");
  const [created_at, setDate] = useState("");

  const handleQuantityChange = (index: number, value: number) => {
    const updated = [...quantities];
    updated[index] = value;
    setQuantities(updated);
  };

  useEffect(() => {
    const fetchItems = async () => {
      if (mode === "edit" && editBlog) {
        setInv(editBlog.inv_id);
        setDate(new Date(editBlog.created_at).toISOString().split("T")[0]);
        setName(editBlog.name);

        const { data: items, error } = await supabase
          .from("items_list")
          .select("*")
          .eq("inv_id", editBlog.inv_id);

        if (!error && items) {
          setFormProducts(items);
          console.log("Form Products:", formProducts);
          setQuantities(items.map((item) => item.quantity));
        }
      } else {
        setInv("");
        setDate("");
        setName("");
        setFormProducts([]);
        setQuantities(products.map(() => 0));
      }
    };

    fetchItems();
  }, [mode, editBlog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = (await supabase.auth.getUser()).data.user;

    const totalAmount = products.reduce(
      (sum, p, i) => sum + (quantities[i] || 0) * p.price,
      0
    );

    if (mode === "edit" && editBlog) {
      // Update invoice with total_amount
      const { data, error } = await supabase
        .from("invoice_list")
        .update({
          inv_id,
          created_at,
          name,
          total_amount: totalAmount,
        })
        .eq("id", editBlog.id);

      if (error) {
        console.error("Update error:", error.message);
      } else {
        console.log("Update success:", data);

        // Optional: clean up and re-insert items
        await supabase.from("items_list").delete().eq("inv_id", inv_id);

        const updatedItems = products.map((product, index) => ({
          inv_id,
          product_name: product.name,
          quantity: quantities[index],
          price: product.price,
          subtotal: quantities[index] * product.price,
        }));
        await supabase.from("items_list").insert(updatedItems);

        dispatch(submitBlog());
      }
    } else {
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoice_list")
        .insert([
          {
            inv_id,
            created_at,
            name,
            user_id: user?.id,
            total_amount: totalAmount,
          },
        ])
        .select();

      if (invoiceError) {
        console.error("Insert error:", invoiceError.message);
      } else {
        console.log("Insert success:", invoiceData);

        const itemEntries = products.map((product, index) => ({
          inv_id,
          product_name: product.name,
          quantity: quantities[index],
          price: product.price,
          subtotal: quantities[index] * product.price,
        }));

        const { error: itemsError } = await supabase
          .from("items_list")
          .insert(itemEntries);

        if (itemsError) {
          console.error("Items insert error:", itemsError.message);
        } else {
          console.log("All items added successfully");
          dispatch(submitBlog());
        }
      }
    }

    setInv("");
    setDate("");
    setName("");
  };

  return (
    <form className="space-y-4 h-full max-h-screen" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">
        {mode === "create" ? "Create New Blog" : "Edit Blog"}
      </h2>

      <input
        type="text"
        placeholder="Invoice No."
        value={inv_id}
        maxLength={20}
        onChange={(e) => setInv(e.target.value)}
        className="block w-full border border-[#E0E0E0] p-2 rounded"
        required
      />
      <input
        type="date"
        value={created_at}
        onChange={(e) => setDate(e.target.value)}
        className="block w-full border border-[#E0E0E0] p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Customer Name"
        value={name}
        maxLength={20}
        onChange={(e) => setName(e.target.value)}
        className="block w-full border border-[#E0E0E0] p-2 rounded mb-12"
        required
      />

      <h3>Products:</h3>
      <table className="border border-[#E0E0E0] w-full">
        <thead>
          <tr>
            <th className="border border-[#E0E0E0] p-2 font-normal">
              Product Name
            </th>
            <th className="border border-[#E0E0E0] p-2 font-normal">
              Quantity
            </th>
            <th className="border border-[#E0E0E0] p-2 font-normal">Price</th>
            <th className="border border-[#E0E0E0] p-2 font-normal">
              Subtotal
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const qty = quantities[index];
            const subtotal = qty * product.price;

            return (
              <tr key={index}>
                <td className="border border-[#E0E0E0] p-2">{product.name}</td>
                <td className="border w-[100px] border-[#E0E0E0] p-2">
                  <input
                    type="number"
                    value={qty}
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                    className="w-full p-1"
                    min={0}
                  />
                </td>
                <td className="border w-[100px] border-[#E0E0E0] p-2">
                  <span className="font-normal">P</span> {product.price}
                </td>
                <td className="border w-[100px] border-[#E0E0E0] p-2">
                  <span className="font-normal">P</span> {subtotal}
                </td>
              </tr>
            );
          })}

          <tr>
            <td colSpan={3} className="p-2 font-normal">
              Total:
            </td>
            <td className="p-2">
              <span className="font-normal">P</span>{" "}
              {products
                .reduce((sum, p, i) => sum + (quantities[i] || 0) * p.price, 0)
                .toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded cursor-pointer"
        >
          {mode === "create" ? "Publish" : "Update"}
        </button>
        <button
          type="button"
          onClick={() => dispatch(setMode(null))}
          className="border border-gray-400 text-gray-700 px-4 py-2 rounded cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
