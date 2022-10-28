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

  const [X_ARIA_TOKEN, setX_ARIA_TOKEN] = useState(() =>
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
    const tokens = {
      access : data.token,
      refresh : data.token
    }
    if (response.status === 200) {
      setAuthTokens(tokens);
      localStorage.setItem("authTokens", JSON.stringify(tokens));
      // history.push("/");
    } else {
        alert("Utilisateur ou mot de passe incorrect !");
    }
    getToken_X_Aria(data)
  };

  const getToken_X_Aria = async (tokens) => {
    console.log(tokens)
    // const response_X_Aria = 
    API.get(`clients/test_user`, { 
      params: {
        'apikey': tokens.token,
      },
      headers: {
        'Authorization': 'Bearer ' + tokens.token
      }})
      .then((res) => {
        // console.log(res.data.data.token)
        localStorage.setItem("X-ARIA-CLIENT-TOKEN", JSON.stringify(res.data.data.token));
      })
      .catch(console.error)
 
      // const data_X_Aria = await response_X_Aria.json();
      // console.log(data_X_Aria)
      // const token_X_ARIA = {
      //   data_X_Aria : data_X_Aria
      // }
      // if (response_X_Aria.status === 200) {
      //   console.log(token_X_ARIA)
      //   setX_ARIA_TOKEN(token_X_ARIA);
      //   // localStorage.setItem("X-ARIA-CLIENT-TOKEN", JSON.stringify(token_X_ARIA.data.token));
      //   history.push("/");
      // } else {
      //     alert("Utilisateur incorrect !");
      // }
  }

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    setX_ARIA_TOKEN(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("X-ARIA-CLIENT-TOKEN");

    history.push("/");
  };

  const contextData = {
    user,
    setUser,
    X_ARIA_TOKEN,
    setX_ARIA_TOKEN,
    authTokens,
    setAuthTokens,
    loginUser,
    getToken_X_Aria,
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

