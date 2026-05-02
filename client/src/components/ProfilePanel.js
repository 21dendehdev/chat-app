import { useEffect, useState } from 'react';

function ProfilePanel({ user, onLogout, onUpdateAvatar }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');

  useEffect(() => {
    setPreview(user?.avatar || '');
    setSelectedFile(null);
  }, [user]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const initials = user?.username
    ? user.username
        .split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase()
    : 'ME';

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    await onUpdateAvatar(selectedFile);
  };

  return (
    <aside className="profile">
      {preview ? (
        <img className="profile-avatar" src={preview} alt="avatar preview" />
      ) : (
        <div className="profile-avatar initials">{initials}</div>
      )}
      <h2>{user?.username || 'Guest'}</h2>
      <p>Status: <span className="status-indicator online">Online</span></p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button className="logout-btn" onClick={handleSave}>Upload Avatar</button>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </aside>
  );
}

export default ProfilePanel;
