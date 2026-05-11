
import { FaComments, FaUsers, FaCog } from "react-icons/fa";

function BottomNav({ activeTab, setActiveTab }) {

  const navItems = [
    {
      id: "chats",
      label: "Chats",
      icon: <FaComments size={22} />
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: <FaUsers size={22} />
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FaCog size={22} />
    }
  ];

  return (
    <div className="bottom-nav">

      {navItems.map((item) => (

        <button
          key={item.id}
          className={`nav-btn ${
            activeTab === item.id ? "active" : ""
          }`}
          onClick={() => setActiveTab(item.id)}
        >

          {item.icon}
          <span>{item.label}</span>

        </button>

      ))}

    </div>
  );
}

export default BottomNav;
