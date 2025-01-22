import React, { useState } from 'react';
import '../css/ProfileEdit.css';
import { blogApi } from '../services/api';

const ProfileEdit = ({ profile, onSave, onCancel }) => {
  const [editedProfile, setEditedProfile] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    avatar_url: profile.avatar_url || '',
    github_url: profile.github_url || '',
    linkedin_url: profile.linkedin_url || '',
    newImage: null
  });
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const imageFile = editedProfile.newImage;
      const updatedProfile = await blogApi.updateProfile(
        {
          name: editedProfile.name,
          bio: editedProfile.bio,
          avatar_url: editedProfile.avatar_url,
          github_url: editedProfile.github_url,
          linkedin_url: editedProfile.linkedin_url
        },
        imageFile
      );
      onSave(updatedProfile);
    } catch (error) {
      setError(error.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({ 
          ...editedProfile, 
          avatar_url: reader.result,
          newImage: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-edit-overlay">
      <form className="profile-edit-form" onSubmit={handleSubmit}>
        <h2>프로필 수정</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-group">
          <label>프로필 이미지</label>
          <div className="image-upload">
            <img 
              src={editedProfile.avatar_url || "https://via.placeholder.com/150"} 
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
            value={editedProfile.name}
            onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>자기소개</label>
          <textarea
            value={editedProfile.bio}
            onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>GitHub 주소</label>
          <input
            type="url"
            value={editedProfile.github_url}
            onChange={(e) => setEditedProfile({...editedProfile, github_url: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>LinkedIn 주소</label>
          <input
            type="url"
            value={editedProfile.linkedin_url}
            onChange={(e) => setEditedProfile({...editedProfile, linkedin_url: e.target.value})}
          />
        </div>

        <div className="form-buttons">
          <button 
            type="submit" 
            className="save-button"
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-button"
            disabled={isSaving}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit; 