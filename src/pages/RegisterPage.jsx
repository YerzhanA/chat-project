import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BsFillKeyFill, BsFillExclamationCircleFill } from "react-icons/bs";
import { checkIsAuth, registerUser } from "../redux/features/authSlice";
import { useDispatch, useSelector } from "react-redux";

function RegsiterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status } = useSelector((state) => state.auth);
  const isAuth = useSelector(checkIsAuth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (status && formData.email != "" && formData.password != "") {
      toast.info(status);
    }

    if (isAuth) navigate("/chats");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, isAuth, navigate]);

  //Добавление данных в formData
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Отправка данных на сервер
  const handleOnSubmit = async () => {
    if (formData.email.includes("@") && formData.password.length > 4) {
      dispatch(registerUser(formData));
    } else {
      // setIsLoading(false);
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

        <div className="w-[50%] sm:w-[400px] pl-0 ml-0 h-[400px] sm:pl-0 sm:ml-9 mt-10 relative">
          <div className="absolute -top-3 left-0">
            <h3 className=" text-[25px] font-bold tracking-wider text-[#fff]">
              Регистрация
            </h3>
          </div>

          <div className="flex flex-col gap-y-3 mt-[12%]">
            <div className="flex gap-x-2 w-[100%] ">
              <input
                onChange={handleOnChange}
                className="bg-[#222222] h-[50px] pl-3 text-[#ffff] w-[100%] sm:w-[96.3%]  rounded-md border-transparent focus:outline-none"
                type="text"
                name="name"
                placeholder="Name"
                value={formData.firstname}
                required
              />
            </div>

            <input
              onChange={handleOnChange}
              className="bg-[#222222] h-[50px] pl-3 text-[#ffff] w-[100%] sm:w-[96.3%] border-transparent focus:outline-none  rounded-md"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              required
            />

            <div className="relative flex flex-col gap-y-3">
              <input
                onChange={handleOnChange}
                className="bg-[#222222] h-[50px] pl-3 text-[#ffff] w-[100%] sm:w-[96.3%] border-transparent focus:outline-none  rounded-md"
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
                    className="text-[#fff] absolute top-3 right-4 sm:right-6 w-[30px] h-[25px] "
                  />
                </button>
              ) : (
                <button type="button">
                  <BsFillExclamationCircleFill
                    onClick={() => setShowPass(!showPass)}
                    className="text-[#fff] absolute top-3 right-4 sm:right-6 w-[30px] h-[25px]"
                  />
                </button>
              )}
            </div>
            <button
              className="bg-[#919192] hover:bg-[#F5F5DC] w-[100%]  sm:w-[96.3%] h-[50px] font-bold text-[#121418] tracking-wide text-[17px] relative  rounded-md"
              onClick={handleOnSubmit}
            >
              <p className="test-[#fff]">Зарегистрироваться</p>
            </button>
            <p className="text-[#fff] text-[12px] tracking-wider font-medium">
              У Вас уже есть аккаунт?
              <Link
                className="text-[#FFDB8B] underline pl-4 text-[18px]"
                to="/login"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegsiterPage;
