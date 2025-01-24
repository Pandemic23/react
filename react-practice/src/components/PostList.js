import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { postStore } from '../stores/PostStore';
import '../css/PostList.css';

const PostList = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    postStore.loadPosts();
  }, []);

  if (postStore.loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (postStore.error) {
    return <div className="error">{postStore.error}</div>;
  }

  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <h2>게시글 목록</h2>
        <button 
          className="write-button"
          onClick={() => navigate('/add')}
        >
          글쓰기
        </button>
      </div>

      <div className="post-list">
        {postStore.posts.map(post => (
          <div key={post.id} className="post-card">
            <Link to={`/post/${post.id}`} className="post-link">
              <div className="post-content">
                {post.image && (
                  <div className="post-image">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      onError={(e) => {
                        e.target.src = "/images/default-thumbnail.jpg";
                      }}
                    />
                  </div>
                )}
                <div className="post-text">
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-meta">
                    <span className="author">{post.author}</span>
                    <span className="separator">·</span>
                    <span className="date">{post.createdAt}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PostList; 