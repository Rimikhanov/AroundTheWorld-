import React, { useState } from "react";
import styles from "./RegistrationScreen.module.css";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase"; // Импортируем уже инициализированные экземпляры
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";

const RegistrationScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setdisplayName] = useState("");
  const [error, setError] = useState("");

  const registerUser = async (email, password, displayName) => {
    try {
      // Проверяем уникальность никнейма
      const usersRef = collection(db, "users");
      const displayNameQuery = query(usersRef, where("displayName", "==", displayName));
      const querySnapshot = await getDocs(displayNameQuery);

      if (!querySnapshot.empty) {
        setError("This displayName is already taken. Please choose another.");
        setTimeout(() => setError(""), 5000);
        return;
      }

      // Создаем нового пользователя
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Получаем ID пользователя
      const userId = userCredential.user.uid;
      console.log("User registered with UID:", userId); // Логирование для диагностики

      // Добавляем данные о пользователе в Firestore
      await setDoc(doc(db, "users", userId), {
        email: email,
        displayName: displayName,
        preferredLanguage: "en",
        created_at: new Date().toISOString(),
      });

      console.log("User data successfully added to Firestore."); // Логирование для диагностики

      // После успешной регистрации и добавления в БД, переходим на страницу логина
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error); // Логирование ошибки
      setError(error.message);
      setTimeout(() => setError(""), 5000);
      if (error.code === "auth/email-already-in-use") {
        setError(
          "This email is already registered. Please use a different email."
        );
      } else if (error.code === "auth/weak-password") {
        setError("Your password is too weak. Please choose a stronger one.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className={styles.registration}>
      <h1>Registration</h1>
      <p>Please enter your username and password!</p>
      <p style={{ color: "red" }}>{error}</p>
      <div className={styles.inputs}>
        <input
          type="email"
          required
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          required
          placeholder="Username"
          onChange={(e) => setdisplayName(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        type="black"
        className={styles.registrationButton}
        onClick={() => registerUser(email, password, displayName)}
        disabled={!email || !password || !displayName}
      >
        Submit
      </Button>
      <div className={styles.toLogin}>
        <p>Already have an account?</p>
        <Link to="/login" className={styles.toLoginLink}>
          <Button type="black" className={styles.toLoginButton}>
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RegistrationScreen;
