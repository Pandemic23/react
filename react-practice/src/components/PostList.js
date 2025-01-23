import { observer } from 'mobx-react-lite';
import { Link, useNavigate } from 'react-router-dom';
import { postStore } from '../stores/PostStore';
import { userStore } from '../stores/UserStore';
import { authStore } from '../stores/AuthStore';
import { useState, useEffect } from 'react';
import { blogApi } from '../services/api';
import '../css/PostList.css';

const PostList = observer(() => {
  const navigate = useNavigate();
  const [hover, setHover] = useState({ good: false, bad: false });

  const handleReaction = async (postId, type) => {
    try {
      await blogApi.updateReaction(postId, type);
      // 게시글 목록 새로고침
      await postStore.loadPosts(postStore.currentPage);
    } catch (error) {
      console.error('리액션 업데이트 에러:', error);
    }
  };

  useEffect(() => {
    // 모든 게시글의 작성자 정보 로드
    postStore.posts.forEach(post => {
      if (post.author_id) {
        userStore.loadUser(post.author_id);
      }
    });
  }, []);

  const Good = ({ postId, likes }) => {
    return (
      <div
        className={`counter ${hover.good ? 'hover' : ''}`}
        onPointerEnter={() => setHover({ ...hover, good: true })}
        onPointerLeave={() => setHover({ ...hover, good: false })}
      >
        <p>
          {likes} <span onClick={() => handleReaction(postId, 'like')}>👍🏽</span>
        </p>
      </div>
    );
  };

  const Bad = ({ postId, dislikes }) => {
    return (
      <div
        className={`counter ${hover.bad ? 'hover' : ''}`}
        onPointerEnter={() => setHover({ ...hover, bad: true })}
        onPointerLeave={() => setHover({ ...hover, bad: false })}
      >
        <p>
          {dislikes} <span onClick={() => handleReaction(postId, 'dislike')}>👎🏾</span>
        </p>
      </div>
    );
  };

  const Pagination = observer(({ currentPage, totalPages, onPageChange }) => {
    return (
      <div className="pagination">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span>페이지 {currentPage} / {totalPages}</span>
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          다음
        </button>
      </div>
    );
  });

  return (
    <>
      <div className="post-list-header">
        <h2>게시글 목록</h2>
        {authStore.user && (
          <button 
            className="write-button"
            onClick={() => navigate('/add')}
          >
            글쓰기
          </button>
        )}
      </div>

      {postStore.posts.map((post) => {
    
        return (
          <div className='list' key={post.id}>
            <div className="post-preview">
              {post.image && (
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="post-thumbnail"
                  onError={(e) => {
                    e.target.src = "/images/default-thumbnail.jpg";
                  }}
                />
              )}
              <div className="post-info">
                <Link to={`/post/${post.id}`}>{post.title}</Link>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span>{post.author || '익명'} · {post.createdAt}</span>
                  <div className='goodbad'>
                    <Good postId={post.id} likes={post.likes} />
                    <Bad postId={post.id} dislikes={post.dislikes} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <Pagination currentPage={postStore.currentPage} totalPages={postStore.totalPages} onPageChange={postStore.setPage} />
    </>
  );
});

export default PostList; 