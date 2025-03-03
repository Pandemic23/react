import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovingC from "../components/MovingC";
import App from "../components/App";
import PostDetail from "../components/PostDetail";
import PostForm from "../components/PostForm";
import PostList from "../components/PostList";
import NotFound from "../components/NotFound";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<PostList />} />
          <Route path="add" element={<PostForm mode="create" />} />
          <Route path="post/:id" element={<PostDetail />} />
          <Route path="post/:id/edit" element={<PostForm mode="edit" />} />
          <Route path="*" element={<NotFound />} />
          <Route path="MovingC" element={<MovingC />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;