import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useHistory, useNavigate } from "react-router-dom";
import API from "../Api";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);

  const history = useNavigate();

  const loginUser = async (username, password) => {
    const response = await fetch("https://apibeta.aria.fr/py/v2/api-token/?", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username:username,
        password:password,
        'group':'Ariaview'
      })
    });
    const data = await response.json();
    console.log(data)
    const tokens = {
      access : data.token,
      refresh : data.token
    }
    if (response.status === 200) {
      console.log(tokens)
      setAuthTokens(tokens);
      // setUser(jwt_decode(data.token));
      localStorage.setItem("authTokens", JSON.stringify(tokens));
      history.push("/");
    } else {
        alert("Utilisateur ou mot de passe incorrect !");
    }
  };


  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    history.push("/");
  };

  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    loginUser,
    logoutUser
  };

  useEffect(() => {
    if (authTokens) {
      setUser(authTokens.access);
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

