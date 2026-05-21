import React, {
  useEffect,
  useState,
  useCallback
} from "react";

import axios from "axios";

// Helper function to generate consistent colors for users
const getAvatarColor = (seed) => {
  const colors = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", 
    "#ef4444", "#f97316", "#f59e0b", "#eab308", 
    "#84cc16", "#10b981", "#14b8a6", "#06b6d4", 
    "#0ea5e9", "#3b82f6", "#6366f1"
  ];
  
  let hash = 0;
  if (seed) {
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

function ContactsPanel({
  onlineUsers,
  unreadCounts,
  onSelectChat,
  currentUser
}) {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FETCH USERS
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_BASE_URL}/api/users`);

      // Remove current logged in user
      const filteredUsers = res.data.filter(
        (user) => user._id !== currentUser?._id
      );

      setUsers(filteredUsers);

    } catch (error) {
      setError("Failed to load contacts");
      console.log("Fetch users error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?._id]);

  // LOAD USERS
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (

    <div className="contacts-panel">

      {/* HEADER */}

      <div className="contacts-header">

        <h2>Contacts</h2>

        <button
          className="refresh-btn"
          onClick={fetchUsers}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {/* CONTACTS LIST */}

      <div className="contacts-list">

        {loading && (
          <div className="loading-state">
            Loading contacts...
          </div>
        )}

        {error && (
          <div className="error-state">
            {error}
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="empty-state">
            No contacts found
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          users.map((contact) => {

            const isOnline =
              onlineUsers.includes(
                contact._id
              );

            return (

              <div
                key={contact._id}
                className="contact-item"
                onClick={() =>
                  onSelectChat({
                    type: "dm",
                    id: contact._id,
                    name: contact.name
                  })
                }
              >

                {/* AVATAR - NEW VERSION WITH COLORS */}

                <div 
                  className="contact-avatar"
                  style={{
                    backgroundColor: getAvatarColor(contact.name || contact._id),
                    backgroundImage: contact.avatar ? `url(${contact.avatar})` : "none",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  {!contact.avatar && (contact.name?.charAt(0) || "?")}

                  {isOnline && (
                    <span className="online-dot"></span>
                  )}

                </div>

                {/* INFO */}

                <div className="contact-info">

                  <h4>
                    {contact.name}
                  </h4>

                  <p>
                    {isOnline
                      ? "Online"
                      : "Offline"}
                  </p>

                </div>

                {/* UNREAD */}

                {(unreadCounts[
                  contact._id
                ] || 0) > 0 && (

                  <div className="unread-badge">

                    {
                      unreadCounts[
                        contact._id
                      ]
                    }

                  </div>

                )}

              </div>

            );
          })
        )}

      </div>

    </div>
  );
}

export default ContactsPanel;