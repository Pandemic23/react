import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovingC from "./MovingC";
import App from "./App";
import PostDetail from './PostDetail';

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/MovingC" element={<MovingC />} />
      </Routes>
    </Router>
  );
};

export default Root;
