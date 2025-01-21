import React, { useState } from 'react';
import '../css/ProfileEdit.css';

const ProfileEdit = ({ profile, onSave, onCancel }) => {
  const [editedProfile, setEditedProfile] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    image: profile.image || '',
    github: profile.github || '',
    linkedin: profile.linkedin || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedProfile);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile({ ...editedProfile, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-edit-overlay">
      <form className="profile-edit-form" onSubmit={handleSubmit}>
        <h2>프로필 수정</h2>
        
        <div className="form-group">
          <label>프로필 이미지</label>
          <div className="image-upload">
            <img 
              src={editedProfile.image || "https://via.placeholder.com/150"} 
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
            value={editedProfile.github}
            onChange={(e) => setEditedProfile({...editedProfile, github: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>LinkedIn 주소</label>
          <input
            type="url"
            value={editedProfile.linkedin}
            onChange={(e) => setEditedProfile({...editedProfile, linkedin: e.target.value})}
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="save-button">저장</button>
          <button type="button" onClick={onCancel} className="cancel-button">취소</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit; 