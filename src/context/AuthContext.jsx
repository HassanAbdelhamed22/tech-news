import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(() => {
    const savedUser = localStorage.getItem("tech_news_user");
    const savedToken = localStorage.getItem("tech_news_token");
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken || null,
    };
  });

  const login = (userData, token) => {
    setAuthState({ user: userData, token });
    localStorage.setItem("tech_news_user", JSON.stringify(userData));
    localStorage.setItem("tech_news_token", token);
  };

  const logout = () => {
    setAuthState({ user: null, token: null });
    localStorage.removeItem("tech_news_user");
    localStorage.removeItem("tech_news_token");
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
