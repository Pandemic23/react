import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '../stores/AuthStore';
import '../css/ProfileEdit.css';

const ProfileEdit = observer(() => {
  const [formData, setFormData] = useState({
    name: authStore.profile?.name || '',
    bio: authStore.profile?.bio || '',
    github_url: authStore.profile?.github_url || '',
    linkedin_url: authStore.profile?.linkedin_url || '',
    avatar_url: authStore.profile?.avatar_url || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

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
    } else {
      setError('이미지 파일만 업로드 가능합니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await authStore.updateProfile({
        ...formData,
        imageFile,
      });
    } catch (error) {
      setError(error.message || '프로필 업데이트에 실패했습니다.');
    }
  };

  return (
    <div className="profile-edit-overlay">
      <div className="profile-edit-modal">
        <h2>프로필 수정</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>프로필 이미지</label>
            <div className="image-preview">
              <img 
                src={authStore.profile?.avatar_url || "/images/default-avatar.jpg"} 
                alt="프로필 미리보기" 
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>자기소개</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>GitHub 주소</label>
            <input
              type="url"
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>LinkedIn 주소</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={() => authStore.setEditingProfile(false)}
            >
              취소
            </button>
            <button 
              type="submit"
              className="save-button"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ProfileEdit; 