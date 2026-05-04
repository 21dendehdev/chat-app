import { useState, useRef } from "react";
import axios from "axios";
import BASE_URL from '../config';

function SettingsPanel({ user, onClose, onUserUpdate, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.avatar || '');
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const API = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      onClose();
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setLoading(true);

    const data = new FormData();
    data.append('avatar', file);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/upload-avatar/${user.id}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      onUserUpdate({ ...user, avatar: response.data.avatar });
      setPreviewUrl(response.data.avatar);
      showMessage('success', 'Profile picture updated successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to upload photo');
      setPreviewUrl(user.avatar || '');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFileSelect(file);
  };

  const handleChangePassword = async () => {
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
      showMessage('error', 'All password fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      showMessage('error', 'New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
     await axios.put(`${BASE_URL}/api/users/password`,  {
        userId: user.id,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password changed successfully!');
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="settings-content">
            <div className="avatar-preview-card">
              {previewUrl ? (
                <img src={previewUrl} alt="Avatar preview" className="avatar-preview" />
              ) : (
                <div className="avatar-empty">No photo selected</div>
              )}
            </div>

            <div className="form-group">
              <label>Select photo from your device</label>
              <button
                type="button"
                onClick={handlePhotoClick}
                disabled={loading}
                className="primary-btn"
              >
                {loading ? 'Uploading...' : 'Choose File'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </div>

            <div className="form-group">
              <button
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="settings-content">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={formData.oldPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, oldPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="primary-btn"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SettingsPanel;
