import {Link} from 'react-router-dom';
import '../css/App.css';
import { useState } from 'react';
import ProfileEdit from './ProfileEdit';

const App=()=> {
  let [posts] = useState([
    {
      id: 1,
      title: '첫번째 게시글',
      excerpt: '첫번째 게시글의 미리보기 내용입니다.',
      image: 'https://via.placeholder.com/300x200',
      createdAt: '2024-03-21'
    },
    // ... 더 많은 게시글
  ]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const [profile, setProfile] = useState({
    name: '관리자 이름',
    bio: '안녕하세요! 저는 블로그 관리자입니다. 웹 개발과 프로그래밍에 관심이 많습니다.',
    image: 'https://via.placeholder.com/150',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com'
  });
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const handleProfileSave = (newProfile) => {
    setProfile(newProfile);
    setIsEditingProfile(false);
  };

  const good = <Good/>
  const bad = <Bad/>

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

      {/* 메인 컨텐츠 레이아웃 */}
      <div className='main-container'>
        {/* 블로그 포스트 영역 */}
        <main className='content-area'>
          {currentPosts.map((post) => (
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
                    <span>{post.createdAt}</span>
                    <div className='goodbad'> {good}{bad} </div>
                  </div>
                </div>
              </div>
              <hr/>
            </div>
          ))}

          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </button>
            <span>페이지 {currentPage}</span>
            <button 
              onClick={() => setCurrentPage(prev => 
                Math.min(prev + 1, Math.ceil(posts.length / postsPerPage))
              )}
              disabled={currentPage >= Math.ceil(posts.length / postsPerPage)}
            >
              다음
            </button>
          </div>
        </main>

        {/* 사이드바 프로필 */}
        <aside className='sidebar'>
          <div className='profile-card'>
            <img 
              src={profile.image} 
              alt="프로필 이미지" 
              className='profile-image'
            />
            <h2>{profile.name}</h2>
            <p className='bio'>{profile.bio}</p>
            <div className='social-links'>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
            <button 
              className="edit-profile-button"
              onClick={() => setIsEditingProfile(true)}
            >
              프로필 수정
            </button>
          </div>
        </aside>
      </div>

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



