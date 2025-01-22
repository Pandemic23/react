import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../css/PostDetail.css';

const PostDetail = () => {
  const { id } = useParams();
  
  // 실제로는 Supabase에서 데이터를 가져와야 합니다
  const post = {
    id: id,
    title: '샘플 게시글',
    content: '이것은 상세 내용입니다. 여기에 긴 텍스트가 들어갑니다.',
    image: 'https://via.placeholder.com/800x400',
    createdAt: '2024-03-21',
    author: '작성자'
  };

  return (
    <div className="App">
      {/* 헤더 메뉴 */}
      <header className='header'>
        <div className='logo'>Blog</div>
        <nav className='main-nav'>
          <Link to="/">홈</Link>
          <Link to="/MovingC">이동하기</Link>
          <Link to="/">카테고리</Link>
          <Link to="/">방명록</Link>
        </nav>
      </header>

      <div className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>작성자: {post.author}</span>
          <span>작성일: {post.createdAt}</span>
        </div>
        {post.image && (
          <div className="post-image">
            <img src={post.image} alt={post.title} />
          </div>
        )}
        <div className="post-content">
          {post.content}
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 