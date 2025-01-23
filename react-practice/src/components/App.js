import {Link} from 'react-router-dom';
import '../css/App.css';
import { useState, useEffect } from 'react';
import ProfileEdit from './ProfileEdit';
import { blogApi } from '../services/api';
import LoginForm from './LoginForm';
import { observer } from 'mobx-react-lite';
import { postStore } from '../stores/PostStore';
import { authStore } from '../stores/AuthStore';

const App = observer(() => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    authStore.checkUser();
  }, []);

  useEffect(() => {
    if (authStore.user) {
      postStore.loadPosts(postStore.currentPage);
    }
  }, [authStore.user]);

  const handleProfileSave = async (newProfile) => {
    try {
      await blogApi.updateProfile(newProfile);
      const updatedProfile = await blogApi.getProfile();
      authStore.profile = updatedProfile;
      setIsEditingProfile(false);
    } catch (error) {
      console.error('프로필 업데이트 에러:', error);
    }
  };

  const handleLoginSuccess = () => {
    authStore.checkUser();
  };

  const handleLogout = async () => {
    try {
      await blogApi.auth.signOut();
      authStore.logout();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  const good = <Good/>
  const bad = <Bad/>

  if (authStore.loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

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

      {!authStore.user ? (
        <LoginForm onLoginSuccess={() => authStore.checkUser()} />
      ) : (
        <div className='main-container'>
          {/* 블로그 포스트 영역 */}
          <main className='content-area'>
            {postStore.posts.map((post) => (
              <div className='list' key={post.id}>
                <div className="post-preview">
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="post-thumbnail"
                    />
                  )}
                  <div className="post-info">
                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-meta">
                      <span>{post.author} · {post.createdAt}</span>
                      <div className='goodbad'> {good}{bad} </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="pagination">
              <button 
                onClick={() => postStore.setPage(postStore.currentPage - 1)}
                disabled={postStore.currentPage === 1}
              >
                이전
              </button>
              <span>페이지 {postStore.currentPage} / {postStore.totalPages}</span>
              <button 
                onClick={() => postStore.setPage(postStore.currentPage + 1)}
                disabled={postStore.currentPage >= postStore.totalPages}
              >
                다음
              </button>
            </div>
          </main>

          {/* 사이드바 프로필 */}
          {authStore.profile && (
            <aside className='sidebar'>
              <div className='profile-card'>
                <img 
                  src={authStore.profile.avatar_url || "/images/default-avatar.jpg"} 
                  alt="프로필 이미지" 
                  className='profile-image'
                />
                <h2>{authStore.profile.name}</h2>
                <p className='bio'>{authStore.profile.bio}</p>
                <div className='social-links'>
                  <a href={authStore.profile.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href={authStore.profile.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                </div>
                <div className="profile-buttons">
                  <button 
                    className="edit-profile-button"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    프로필 수정
                  </button>
                  <button 
                    className="logout-button"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </aside>
          )}
        </div>
      )}

      {isEditingProfile && (
        <ProfileEdit 
          profile={authStore.profile}
          onSave={handleProfileSave}
          onCancel={() => setIsEditingProfile(false)}
        />
      )}
    </div>
  );
});

function Good() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <p>{score}      <span onClick={() => setScore(score + 1)}>
        👍🏽
      </span></p>

    </div>
  );
}
function Bad() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <p>{score} <span onClick={() => setScore(score + 1)}>
      👎🏾
      </span></p>
     
    </div>
  );
}

export default App;



