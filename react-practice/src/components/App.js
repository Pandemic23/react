import {Link} from 'react-router-dom';
import '../css/App.css';
import { useState, useEffect } from 'react';
import ProfileEdit from './ProfileEdit';
import { blogApi } from '../services/api';
import LoginForm from './LoginForm';

const App=()=> {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await blogApi.auth.getCurrentUser();
      console.log('현재 사용자 상태:', currentUser);
      
      if (currentUser) {
        setUser(currentUser);
        try {
          const profileData = await blogApi.getProfile();
          setProfile(profileData);
        } catch (profileError) {
          console.error('프로필 로드 에러:', profileError);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('사용자 확인 에러:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSave = async (newProfile) => {
    try {
      await blogApi.updateProfile(newProfile);
      const updatedProfile = await blogApi.getProfile();
      setProfile(updatedProfile);
      setIsEditingProfile(false);
    } catch (error) {
      console.error('프로필 업데이트 에러:', error);
    }
  };

  const handleLoginSuccess = () => {
    window.location.reload(); // 로그인 성공 후 페이지 새로고침
  };

  const handleLogout = async () => {
    try {
      await blogApi.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  const good = <Good/>
  const bad = <Bad/>

  // 게시글 로드 함수
  const loadPosts = async (page) => {
    try {
      const { content, totalPages } = await blogApi.getPosts(page - 1);
      setPosts(content);
      console.log(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('게시글 로드 에러:', error);
    }
  };

  // 게시글 로드 useEffect
  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  if (loading) {
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

      {!user ? (
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className='main-container'>
          {/* 블로그 포스트 영역 */}
          <main className='content-area'>
            {posts.map((post) => (
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
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                이전
              </button>
              <span>페이지 {currentPage} / {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => 
                  Math.min(prev + 1, totalPages)
                )}
                disabled={currentPage >= totalPages}
              >
                다음
              </button>
            </div>
          </main>

          {/* 사이드바 프로필 */}
          {!loading && profile && (
            <aside className='sidebar'>
              <div className='profile-card'>
                <img 
                  src={profile.avatar_url || "/images/default-avatar.jpg"} 
                  alt="프로필 이미지" 
                  className='profile-image'
                />
                <h2>{profile.name}</h2>
                <p className='bio'>{profile.bio}</p>
                <div className='social-links'>
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a>
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
          profile={profile}
          onSave={handleProfileSave}
          onCancel={() => setIsEditingProfile(false)}
        />
      )}
    </div>
  );
}

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



