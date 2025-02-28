import React from "react";
import styles from "./LoginScreen.module.css";
import { Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase.js"; // Импортируем auth из firebase.js
import { signInWithEmailAndPassword } from "firebase/auth"; // Импортируем signInWithEmailAndPassword

const LoginScreen = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Пытаемся авторизовать пользователя
      await signInWithEmailAndPassword(auth, email, password);
      // Если авторизация успешна, переходим на чат-лист
      navigate("/chatlist");
    } catch (err) {
      console.error("Error:", err.message); // Показываем сообщение ошибки
      setError(err.message); // Отображаем его пользователю, если нужно
    }
    
  };

  return (
    <div className={styles.Login}>
      <h1>Around the world</h1>
      <p>Please enter your username and password!</p>
      {error && <h4 className={styles.error}>{error}</h4>}
      <div className={styles.inputs}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
      </div>

      <Button type="black" className={styles.LoginButton} onClick={handleLogin}>
        Submit
      </Button>

      <div className={styles.toRegistration}>
        <p>Don't have an account?</p>
        <Link to="/registration" className={styles.toRegistrationLink}>
          <Button type="black" className={styles.toRegistrationButton}>
            Registration
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
