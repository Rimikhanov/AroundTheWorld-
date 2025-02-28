import React, { useState, useEffect } from "react";
import styles from "./LanguageSelector.module.css";
import { db, auth } from "../../../firebase"; // Импортируем Firebase
import { doc, setDoc, getDoc } from "firebase/firestore"; // Импортируем методы для работы с Firebase

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "ru", name: "Russian" },
    // можно добавить больше языков по мере необходимости
  ];

  // Получаем текущий язык пользователя из Firebase при монтировании компонента
  useEffect(() => {
    const fetchUserLanguage = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setSelectedLanguage(userData.preferredLanguage || "en"); // Устанавливаем язык из базы данных, если он есть
          }
        } catch (error) {
          console.error("Error fetching user language:", error);
        }
      }
    };

    fetchUserLanguage();
  }, []);

  // Функция для обновления языка в Firebase
  const handleChange = async (event) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage); // Обновляем локальное состояние

    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
        // Обновляем предпочтительный язык пользователя в Firebase
        await setDoc(
          doc(db, "users", currentUser.uid), // Путь к документу пользователя
          { preferredLanguage: newLanguage }, // Обновляем только поле preferredLanguage
          { merge: true } // Убедимся, что не перезапишем остальные поля
        );
      } catch (error) {
        console.error("Error updating language:", error);
      }
    }
  };

  return (
    <div className={styles.languageSelector}>
      <h2 className={styles.title}>Your Preferred Language:</h2>
      <select value={selectedLanguage} onChange={handleChange}>
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
