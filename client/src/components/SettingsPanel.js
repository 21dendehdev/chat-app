function SettingsPanel({
  user,
  onLogout
}) {

  return (

    <div className="settings-panel">

      {/* HEADER */}

      <div className="settings-header">

        <h2>Settings</h2>

      </div>

      {/* PROFILE CARD */}

      <div className="profile-card">

        {/* AVATAR */}

        <div className="profile-avatar">

          {user?.username?.charAt(0)}

        </div>

        {/* USER INFO */}

        <div className="profile-info">

          <h3>{user?.username}</h3>

          <p>{user?.email}</p>

        </div>

      </div>

      {/* ACCOUNT INFO */}

      <div className="settings-section">

        <h4>Account Information</h4>

        <div className="setting-item">

          <span>User ID</span>

          <p>{user?.id}</p>

        </div>

        <div className="setting-item">

          <span>Status</span>

          <p className="online-text">
            Online
          </p>

        </div>

      </div>

      {/* ACTIONS */}

      <div className="settings-section">

        <button
          className="logout-btn"
          onClick={onLogout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default SettingsPanel;