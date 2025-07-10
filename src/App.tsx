import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Signup";
import Admin from "./pages/Admin";

const App = () => {
  return (
    <div className="text-sm text-black font-semibold">
      <BrowserRouter basename="/Invoice-System">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
