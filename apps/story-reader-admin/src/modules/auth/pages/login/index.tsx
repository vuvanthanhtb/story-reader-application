import { type FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "app/redux/store";
import { FormComponent } from "shared/components";
import { LoginRequest } from "modules/auth/business/model.auth";
import { initialValues, loginConfig } from "./config.login";
import { loginUser } from "modules/auth/business/slice.auth";
import BackgroundLogin from "assets/backgound-login.jpg";
import Avatar from "assets/backgound-login.jpg";
import styles from "./login.module.scss";

const Login: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLogin } = useSelector((state: RootState) => state.auth);
  const [formValues, setFormValues] = useState<LoginRequest>(initialValues);

  useEffect(() => {
    document.title = "Đăng nhập";
    if (isLogin) {
      navigate("/", { replace: true });
    }
  }, [isLogin, navigate]);

  const onChange = (data: Record<string, any>) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...data,
    }));
  };

  const handleSubmit = (data: LoginRequest) => {
    dispatch(loginUser(data));
  };

  return (
    <div className={styles["login-container"]}>
      <img src={BackgroundLogin} alt="login" />
      <div className={styles["form-login"]}>
        <img className={styles["form-login__image"]} src={Avatar} alt="login" />
        <label className={styles["form-login__title"]}>
          Story Reader Application
        </label>
        <FormComponent
          formConfig={loginConfig}
          values={formValues}
          onChange={onChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Login;
