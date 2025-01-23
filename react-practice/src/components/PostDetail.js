import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogApi } from '../services/api';
import '../css/PostDetail.css';
import { observer } from 'mobx-react-lite';
import MainLayout from './layout/MainLayout';
import { userStore } from '../stores/UserStore';

const PostDetail = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [navigation, setNavigation] = useState({
    prev: null,
    next: null
  });

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await blogApi.getPost(parseInt(id));
        if (postData.author_id) {
          await userStore.loadUser(postData.author_id);
        }
        setPost(postData);
        
        // 이전/다음 게시물 가져오기
        const { data: navData } = await blogApi.getPostNavigation(parseInt(id));
        setNavigation(navData);
      } catch (error) {
        console.error('게시물 로드 에러:', error);
      }
    };

    loadPost();
  }, [id]);

  if (!post) return <div>로딩 중...</div>;

  return (
    <MainLayout>
      <div className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>작성자: {post.author}</span>
          <span>작성일: {post.createdAt}</span>
        </div>
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
        <div className="post-content">
          {post.content}
        </div>
        
        <footer className="post-navigation">
          <div className="nav-links">
            {navigation.prev && (
              <Link to={`/post/${navigation.prev.id}`} className="nav-link prev">
                <span className="nav-label">이전 글</span>
                <span className="nav-title">{navigation.prev.title}</span>
              </Link>
            )}
            
            <button onClick={() => navigate('/')} className="nav-home">
              목록으로
            </button>
            
            {navigation.next && (
              <Link to={`/post/${navigation.next.id}`} className="nav-link next">
                <span className="nav-label">다음 글</span>
                <span className="nav-title">{navigation.next.title}</span>
              </Link>
            )}
          </div>
        </footer>
      </div>
    </MainLayout>
  );
});

export default PostDetail; 