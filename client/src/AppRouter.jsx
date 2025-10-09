import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";  // your current form flow
import FormAdmin from "./pages/FormAdmin";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Registration-Admin" element={<FormAdmin />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
