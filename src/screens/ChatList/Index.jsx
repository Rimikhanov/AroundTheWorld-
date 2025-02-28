import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db, auth } from "../../firebase";
import styles from "./ChatList.module.css";
import LanguageSelector from "../components/LanguageSelector/Index";
import FriendSearch from "../components/FriendSearch/Index";
import SignOut from "../components/SignOut/Index";

// Иконка загрузки (можно заменить на свою)
const LoadingSpinner = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="30" height="30" className={styles.spinner}>
    <circle cx="25" cy="25" r="20" stroke="#4fa94d" strokeWidth="5" fill="none" />
    <circle cx="25" cy="25" r="20" stroke="#fff" strokeWidth="5" fill="none" strokeDasharray="125.6" strokeDashoffset="125.6" strokeLinecap="round" className={styles.spinnerCircle} />
  </svg>
);

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция для загрузки чатов
  const fetchChats = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const isAdmin = currentUser.uid === "8VVKBopSCyO7hpArDB0iijyCtAy1"; // Замените на uid админа

        let chatsRef = collection(db, "chats");
        let q;

        if (isAdmin) {
          q = query(chatsRef); // Все чаты для админа
        } else {
          q = query(chatsRef, where("participants_id", "array-contains", currentUser.uid)); // Чаты для обычного пользователя
        }

        const querySnapshot = await getDocs(q);
        const chatsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setChats(chatsData);
      } else {
        setError("No current user found");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем чаты при монтировании компонента
  useEffect(() => {
    fetchChats();
  }, [db, auth]);

  // Функция для ручной перезагрузки чатов
  const reloadChats = () => {
    setLoading(true); // Устанавливаем состояние загрузки
    setChats([]); // Очищаем текущие чаты
    fetchChats(); // Перезапускаем загрузку
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <LoadingSpinner /> {/* Показываем спиннер */}
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div>
      <h2 className={styles.title}>Your Chats</h2>
      <div className={styles.header}>
        <LanguageSelector />
        <div className={styles.headerButtons}>
        <FriendSearch />
        <button className={styles.reloadButton} onClick={reloadChats}>
        <LoadingSpinner /> 
      </button>
        <SignOut />
        </div>
      </div>
      {chats.length === 0 ? (
        <p className={styles.noChats}>No chats available</p>
      ) : (
        <ul className={styles.chatList}>
          {chats.map((chat) => (
            <li key={chat.id} className={styles.chatItem}>
              <Link to={`/chat/${chat.id}`} className={styles.chatLink}>
                <div>
                  <h3>{chat.name}</h3>
                  <div className={styles.lastMessage}>
                    <p>{chat.last_message}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      
    </div>
  );
};

export default ChatList;
