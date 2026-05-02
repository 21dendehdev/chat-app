function UserList({ users, activeReceiver, onSelectUser, onRefresh }) {
  return (
    <section className="conversations">
      <div className="conversations-header">
        <h3>Conversations</h3>
        <button onClick={onRefresh}>Refresh</button>
      </div>
      <div className="users">
        {users.length > 0 ? (
          users.map((receiver) => (
            <div
              key={receiver._id}
              className={`user ${activeReceiver?._id === receiver._id ? 'active' : ''}`}
              onClick={() => onSelectUser(receiver)}
            >
              {receiver.avatar ? (
                <img src={receiver.avatar} alt={receiver.username} className="user-avatar" />
              ) : (
                <span className="user-initials">{receiver.username.slice(0, 2).toUpperCase()}</span>
              )}
              <span>{receiver.username}</span>
            </div>
          ))
        ) : (
          <p className="empty-state">No conversations available.</p>
        )}
      </div>
    </section>
  );
}

export default UserList;
