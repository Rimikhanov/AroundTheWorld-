// src/screens/SearchScreen/Index.jsx
import React from "react";
import styles from "./SearchScreen.module.css";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase"; // Импортируем уже инициализированные экземпляры
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

const SearchScreen = () => {
  const navigate = useNavigate();
  const [queryTerm, setQuery] = React.useState("");
  const [users, setUsers] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false); // Стейт для модалки
  const [chatName, setChatName] = React.useState(""); // Стейт для названия чата
  const [selectedUser, setSelectedUser] = React.useState(null); // Стейт для выбранного пользователя

  React.useEffect(() => {
    if (queryTerm.length > 0) {
      const fetchUsers = async () => {
        const usersCollection = collection(db, "users"); // Получаем ссылку на коллекцию
        const q = query(
          usersCollection,
          where("displayName", ">=", queryTerm),
          where("displayName", "<=", queryTerm + "\uf8ff")
        );

        const querySnapshot = await getDocs(q); // Получаем документы по запросу
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Извлекаем ID документа
          displayName: doc.data().displayName,
        }));
        setUsers(results);
      };

      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [queryTerm]);

  const startChat = async (user) => {
    setSelectedUser(user); // Сохраняем выбранного пользователя
    setShowModal(true); // Показываем модалку
  };

  const handleCreateChat = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !chatName.trim()) {
      return;
    }

    const currentUserId = currentUser.uid;
    const chatCollection = collection(db, "chats");

    // Создаем новый чат с названием и участниками
    const docRef = await addDoc(chatCollection, {
      name: chatName,
      participants_id: [currentUserId, selectedUser.id], // Сохраняем только UID участников
      createdAt: new Date(),
    });

    // После создания чата, закрываем модалку
    setShowModal(false);
    setChatName(""); // Очищаем название чата

    // Переходим на страницу чата (можно передать docRef.id, чтобы попасть в чат)
    navigate(`/chatlist`);
  };

  return (
    <div className={styles.searchContent}>
      <div className={styles.searchHeader}>
        <h2>Search</h2>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="Поиск пользователя..."
            value={queryTerm}
            onChange={(e) => setQuery(e.target.value)}
          />
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <Link to={"/chatlist"}>
          <svg
            className={styles.backArrow}
            width="800px"
            height="800px"
            viewBox="0 0 512 512"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="st0"
              d="M217,129.88c-6.25-6.25-16.38-6.25-22.63,0L79.61,244.64c-0.39,0.39-0.76,0.8-1.11,1.23    c-0.11,0.13-0.2,0.27-0.31,0.41c-0.21,0.28-0.42,0.55-0.62,0.84c-0.14,0.21-0.26,0.43-0.39,0.64c-0.14,0.23-0.28,0.46-0.41,0.7    c-0.13,0.24-0.24,0.48-0.35,0.73c-0.11,0.23-0.22,0.45-0.32,0.68c-0.11,0.26-0.19,0.52-0.28,0.78c-0.08,0.23-0.17,0.46-0.24,0.69    c-0.09,0.29-0.15,0.58-0.22,0.86c-0.05,0.22-0.11,0.43-0.16,0.65c-0.08,0.38-0.13,0.76-0.17,1.14c-0.02,0.14-0.04,0.27-0.06,0.41    c-0.11,1.07-0.11,2.15,0,3.22c0.01,0.06,0.02,0.12,0.03,0.18c0.05,0.46,0.12,0.92,0.21,1.37c0.03,0.13,0.07,0.26,0.1,0.39    c0.09,0.38,0.18,0.76,0.29,1.13c0.04,0.13,0.09,0.26,0.14,0.4c0.12,0.36,0.25,0.73,0.4,1.09c0.05,0.11,0.1,0.21,0.15,0.32    c0.17,0.37,0.34,0.74,0.53,1.1c0.04,0.07,0.09,0.14,0.13,0.21c0.21,0.38,0.44,0.76,0.68,1.13c0.02,0.03,0.04,0.06,0.06,0.09    c0.55,0.81,1.18,1.58,1.89,2.29l114.81,114.81c3.12,3.12,7.22,4.69,11.31,4.69s8.19-1.56,11.31-4.69c6.25-6.25,6.25-16.38,0-22.63    l-87.5-87.5h291.62c8.84,0,16-7.16,16-16s-7.16-16-16-16H129.51L217,152.5C223.25,146.26,223.25,136.13,217,129.88z"
            />
          </svg>
        </Link>
      </div>
      <div className={styles.users}>
        {users.map((user) => (
          <div key={user.id} className={styles.user}>
            <p className={styles.displayName}>{user.displayName}</p>
            <button onClick={() => startChat(user)}>Начать чат</button>
          </div>
        ))}
      </div>

      {/* Модальное окно для ввода названия чата */}
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3   className={styles.modalTitle}>Введите название чата</h3>
            <input
              type="text"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Название чата"
            />
            <div className={styles.modalButtons}>
            <button onClick={handleCreateChat}>Создать чат</button>
            <button onClick={() => setShowModal(false)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchScreen;
