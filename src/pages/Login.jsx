import React, { useContext, useState } from "react";
import styles from "./login.module.css";
import Cookies from "js-cookie";
import InputFieldWithLabel from "./InputFieldWithLabel.jsx";
import axios from "axios";
import { LoginContext } from "../context/LoginContext.jsx";
function Login() {
  const [values, setValues] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleLogin = async (e) => {
    const { username, password } = values;
    e.preventDefault();
    setError(null);
    if (username.trim() && password.trim()) {
      try {
        setLoading(true);
        const data = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/authenticate`,
          { username, password }
        );
        Cookies.set("rush_session_id", data.data.session_id);
      } catch (error) {
        if (error.status === 403) {
          setError("الرجاء التأكد من اسم المستخدم وكلمة المرور");
        } else {
          setError(error.message);
        }
      }
    } else {
      setError("الرجاء التأكد من ادخال جميع الحقول المطلوبة");
    }
    setLoading(false);
  };
  const handleChangeValue = (id, value) => {
    setValues((old) => {
      return { ...old, [id]: value };
    });
  };
  return (
    <div className={styles.loginContainer}>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className={[
            styles.loginCard,
            " d-flex justify-content-center align-items-center flex-column",
          ].join(" ")}
        >
          <div
            className={`d-flex flex-row gap-3 flex-wrap justify-content-center align-items-center`}
          >
            <h1 className={`${styles.loginText} text-black`}>مرحبا بكم في</h1>
            <img className={styles.loginImg} src="/Frame11.png" />
          </div>
          <form
            onSubmit={handleLogin}
            style={{ marginTop: "30px", gap: "16px" }}
            className={[
              styles.loginField,
              "align-items-start justify-content-start d-flex flex-column w-100",
            ].join(" ")}
          >
            <InputFieldWithLabel
              id={"username"}
              placeholder="ادخل اسم المستخدم"
              name={"username"}
              type={"text"}
              label={"اسم المستخدم"}
              onChange={(e) => handleChangeValue("username", e.target.value)}
            />
            <InputFieldWithLabel
              id={"password"}
              placeholder="ادخل كلمة المرور"
              name={"password"}
              type={"password"}
              label={" كلمة المرور"}
              onChange={(e) => handleChangeValue("password", e.target.value)}
            />
            <button disabled={loading} className={styles.loginButton}>
              <p>{loading ? "جاري التحميل..." : "دخول"}</p>
            </button>
            {error && <p className="text-error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
