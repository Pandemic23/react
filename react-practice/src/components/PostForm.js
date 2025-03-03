import React, { useState, useEffect, use } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { blogApi } from '../services/api';
import { postStore } from '../stores/PostStore';
import '../css/PostForm.css';



const PostForm = observer(({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      if (mode === 'edit' && id) {
        try {
          const postData = await blogApi.getPost(parseInt(id));
          setPost(postData);
          setFormData({
            title: postData.title,
            content: postData.content,
            excerpt: postData.excerpt || '',
          });
          if (postData.image) {
            setImagePreview(postData.image);
          }
        } catch (error) {
          setError('게시글을 불러올 수 없습니다.');
          navigate('/');
        }
      }
    };

    loadPost();
  }, [mode, id, navigate]);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await blogApi.auth.getCurrentUser();
        setCurrentUser(user);
        if (!user && mode === 'create') {
          setError('로그인이 필요합니다.');
          navigate('/login');
        }
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
      }
    };
    getCurrentUser();
  }, [mode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      // 이미지 미리보기 URL 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setError('이미지 파일만 업로드 가능합니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!currentUser && mode === 'create') {
      setError('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      const postDataToSubmit = {
        ...formData,
        image_url: !imageFile && post?.image ? post.image : undefined,
        author_id: currentUser?.id
      };

      if (mode === 'create') {
        await postStore.createPost(postDataToSubmit, imageFile);
      } else {
        await postStore.updatePost(id, postDataToSubmit, imageFile);
      }
      navigate('/', { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <form className="post-form" onSubmit={handleSubmit}>
        <h2>{mode === 'create' ? '새 게시글 작성' : '게시글 수정'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">요약</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="2"
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">이미지</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {post?.image && (
            <div className="current-image">
              <img src={post.image} alt="현재 이미지" />
              <span>현재 이미지</span>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            disabled={loading}
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={loading}
          >
            {loading ? '처리 중...' : mode === 'create' ? '작성하기' : '수정하기'}
          </button>
        </div>
      </form>
  );
});

export default PostForm;
