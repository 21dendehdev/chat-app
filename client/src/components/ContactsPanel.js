function ContactsPanel({
  contacts,
  onlineUsers,
  unreadCounts,
  onSelectChat,
  onRefreshUsers
}) {

  return (

    <div className="contacts-panel">

      {/* HEADER */}

      <div className="contacts-header">

        <h2>Contacts</h2>

        <button
          className="refresh-btn"
          onClick={onRefreshUsers}
        >
          Refresh
        </button>

      </div>

      {/* CONTACTS LIST */}

      <div className="contacts-list">

        {contacts.length === 0 ? (

          <div className="empty-state">
            No contacts found
          </div>

        ) : (

          contacts.map((contact) => {

            const isOnline =
              onlineUsers.includes(contact._id);

            return (

              <div
                key={contact._id}
                className="contact-item"
                onClick={() =>
                  onSelectChat({
                    type: "dm",
                    id: contact._id,
                    name: contact.username
                  })
                }
              >

                {/* AVATAR */}

                <div className="contact-avatar">

                  {contact.username?.charAt(0)}

                  {isOnline && (
                    <span className="online-dot"></span>
                  )}

                </div>

                {/* INFO */}

                <div className="contact-info">

                  <h4>{contact.username}</h4>

                  <p>
                    {isOnline
                      ? "Online"
                      : "Offline"}
                  </p>

                </div>

                {/* UNREAD */}

                {unreadCounts[contact._id] > 0 && (

                  <div className="unread-badge">
                    {unreadCounts[contact._id]}
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