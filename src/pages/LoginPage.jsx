import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFillKeyFill, BsFillExclamationCircleFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { checkIsAuth, loginUser } from "../redux/features/authSlice.js";
import { useDispatch, useSelector } from "react-redux";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status } = useSelector((state) => state.auth);
  const isAuth = useSelector(checkIsAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (status && formData.email != "" && formData.password != "") {
      toast.info(status);
    }
    if (isAuth) {
      navigate("/chats");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isAuth, navigate]);

  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendLogin = async () => {
    if (formData.email.includes("@") && formData.password.length > 4) {
      dispatch(loginUser(formData));
    } else {
      toast.warning("Не валидный email или пароль!");
      setFormData({ ...formData, password: "" });
    }
  };

  return (
    <>
      <div className="bg-black w-[100vw] h-[100vh] flex justify-center items-center">
        <div className="w-[600px] h-[600px] ">
          <div className="bg-[url('./assets/images/cat.jpg')] bg-contain bg-center bg-no-repeat text-[#fff] w-full h-full"></div>
        </div>

        <div className="w-[90%] sm:w-[400px] pl-0 ml-0 h-[400px] sm:pl-0 sm:ml-9 mt-20 relative">
          <div className="absolute -top-3 left-0">
            <h3 className=" text-[25px] font-bold tracking-wider text-[#fff]">
              Войти
            </h3>
          </div>

          <div className="flex flex-col gap-y-3 mt-[12%]">
            <div className="w-[100%]">
              <input
                className="w-[100%] sm:w-[80%] bg-[#222222] h-[50px] pl-3 text-[#ffff] focus:outline-none  rounded-md"
                onChange={handleOnChange}
                name="email"
                type="text"
                placeholder="Email"
                value={formData.email}
                required
              />
            </div>
            <div className="relative">
              <input
                className="w-[100%] sm:w-[80%] bg-[#222222] h-[50px] pl-3 text-[#ffff] focus:outline-none  rounded-md"
                onChange={handleOnChange}
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                required
              />
              {!showPass ? (
                <button type="button">
                  <BsFillKeyFill
                    onClick={() => setShowPass(!showPass)}
                    className="text-[#fff] absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]"
                  />
                </button>
              ) : (
                <button type="button">
                  <BsFillExclamationCircleFill
                    onClick={() => setShowPass(!showPass)}
                    className="text-[#fff] absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]"
                  />
                </button>
              )}
            </div>

            <button
              className="bg-[#919192] hover:bg-[#F5F5DC]  transition duration-300 w-[100%]  sm:w-[80%] h-[50px] font-bold text-[#121418] tracking-wide text-[17px] relative  rounded-md"
              onClick={handleSendLogin}
            >
              <p className="test-[#fff]">Войти</p>
            </button>
            <p className="text-[#fff] text-[12px] tracking-wider font-medium">
              У Вас нет аккаунта?
              <Link
                className="text-[#FFDB8B] underline pl-4 text-[16px]"
                to="/register"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
