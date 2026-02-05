import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Form from "./Form.jsx";
import FormUpdate from "./FormUpdate.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/anime/:id" element={<App />} />
      <Route path="/anime/post/:user_id" element={<Form />} />
      <Route path="/anime/update/:user_id/:anime_id" element={<FormUpdate />} />
    </Routes>
  </BrowserRouter>
);
