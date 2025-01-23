import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '../../stores/AuthStore';

const MainLayout = observer(({ children }) => {
  return (
    <div className="App">
      <header className='header'>
        <div className='logo'>Blog</div>
        <nav className='main-nav'>
          <Link to="/">홈</Link>
          <Link to="/MovingC">이동하기</Link>
          <Link to="/">카테고리</Link>
          <Link to="/">방명록</Link>
        </nav>
      </header>

      <div className='main-container'>
        {/* 메인 컨텐츠 영역 */}
        <main className='content-area'>
          {children}
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
                  onClick={() => authStore.setEditingProfile(true)}
                >
                  프로필 수정
                </button>
                <button 
                  className="logout-button"
                  onClick={() => authStore.logout()}
                >
                  로그아웃
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
});

export default MainLayout; 