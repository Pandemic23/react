import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovingC from "./MovingC";
import App from "./App";

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/MovingC" element={<MovingC />} />
      </Routes>
    </Router>
  );
};

export default Root;
