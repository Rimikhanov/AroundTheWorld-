import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../../firebase";
import { collection, query, where, orderBy, addDoc, onSnapshot, doc, getDoc } from "firebase/firestore";
import { useParams, Link } from "react-router-dom";
import styles from "./ChatScreen.module.css";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatName, setChatName] = useState(""); // Состояние для имени чата
  const { chatId } = useParams(); // Получаем chatId из URL
  const currentUser = auth.currentUser;

  // Реф для последнего сообщения
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (chatId) {
      // Получаем имя чата по его chatId
      const fetchChatData = async () => {
        try {
          const chatRef = doc(db, "chats", chatId); // Ссылаемся на коллекцию чатов
          const chatDoc = await getDoc(chatRef);

          if (chatDoc.exists()) {
            setChatName(chatDoc.data().name); // Получаем имя чата
          } else {
            console.log("Chat not found!");
          }
        } catch (err) {
          console.error("Error fetching chat data: ", err);
        }
      };

      fetchChatData();

      // Получаем сообщения для текущего чата по полю chat_id
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("chat_id", "==", chatId),
        orderBy("createdAt")
      );

      // onSnapshot будет слушать изменения и автоматически обновлять данные
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData); // Обновляем состояние с новыми сообщениями
      });

      // Очищаем слушателя при размонтировании компонента
      return () => unsubscribe();
    }
  }, [chatId]);

  useEffect(() => {
    // Прокручиваем к последнему сообщению
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Срабатывает, когда список сообщений обновляется

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return; // Проверка на пустое сообщение

    try {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        chat_id: chatId, // Связываем сообщение с чатом
        createdAt: new Date(),
      });
      setNewMessage(""); // Очищаем поле ввода
    } catch (err) {
      console.error("Error sending message: ", err);
    }
  };

  // Обработчик для отправки сообщения при нажатии клавиши Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Предотвращаем отправку формы (если она есть)
      handleSendMessage(); // Отправляем сообщение
    }
  };

  if (!chatId || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        {/* Кнопка выхода */}
        <Link to="/chatlist" className={styles.exitButton}>
          <button>Back to Chat List</button>
        </Link>
        <h2 className={styles.chatTitle}>{chatName || "Loading chat name..."}</h2>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.senderId === currentUser.uid ? styles.myMessage : styles.otherMessage}
          >
            <p>{message.text}</p>
          </div>
        ))}
        {/* Элемент для прокрутки вниз */}
        <div ref={lastMessageRef} />
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Добавляем обработчик для нажатия клавиши
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatScreen;
