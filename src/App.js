import React from 'react';
import './App.css';
import LoginScreen from './screens/LoginScreen/Index.jsx';
import RegistrationScreen from './screens/RegistrationScreen/Index.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Используем Routes вместо Switch
import ChatList from './screens/ChatList/Index.jsx';
import SearchScreen from './screens/SearchScreen/Index.jsx';
import ChatScreen from './screens/ChatScreen/Index.jsx';
// import { LanguageProvider } from "./translateService.js"
function App() {
  return (
    <div className="App">
      {/* <LanguageProvider> */}
      <Router>
        <Routes>
          {/* Здесь передаем компоненты как JSX с element */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="*" element={<LoginScreen />} />
          <Route path="/chat/:chatId" element={<ChatScreen />} />
          <Route path="/registration" element={<RegistrationScreen />} />
          <Route path="/chatlist" element={<ChatList />} />
          <Route path="/Search" element={<SearchScreen />} />

        </Routes>
      </Router>
      {/* </LanguageProvider> */}
    </div>
  );
}

export default App;
