import { useState } from "react";
import { FcHome } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { ImExit } from "react-icons/im";
import ProfileEdit from "../components/ProfileEdit";
import { updateUser, updatePicture } from "../api/user";
import { toast } from "react-toastify";
import { setUserName, setPicture } from "../redux/features/activeUserSlice";
import { setShowProfile } from "../redux/features/profileSlice";
import "../pages/home.css";
function Profile() {
  const dispatch = useDispatch();
  const { showProfile } = useSelector((state) => state.profile);
  const activeUser = useSelector((state) => state.activeUser);

  // Переменные состояния для хранения данных и изображения
  const [formData, setFormData] = useState({
    name: activeUser.name,
    picture: activeUser.picture,
    email: activeUser.email,
  });

  //Изменяем картинка
  const handleChangeImg = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (file) {
      submitUserPicture(file);
    }
  };

  //Изменяем имя
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Отправка пользователя картинка
  const submitUserPicture = async (file) => {
    const data = new FormData();
    data.append("image", file);
    try {
      const updatedPicture = await updatePicture(activeUser.id, data);
      dispatch(setPicture(updatedPicture)); // Обновляем picture в Redux Store
      toast.success("Аватарка изменена!");
    } catch (error) {
      toast.error("Ошибка при обновлении картинки");
    }
  };

  //Отправка данные имени пользователя
  const submitUserName = async () => {
    //для отображения имени на фомре
    dispatch(setUserName(formData));
    toast.success("Имя изменено!");
    await updateUser(activeUser.id, formData);
  };

  //Выход из системы
  const logoutUser = () => {
    toast.success("Вы вышли из системы!");
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  };

  return (
    // блок профиля
    <div
      style={{ transition: showProfile ? "0.3s ease-in-out" : "" }}
      className="profile-page h-[900px] min-w-[400px] bg-[#543d27] shodow-xl relative rounded-l-lg"
    >
      {/* <div className="w-[100%] absolute "> */}
      <div className="h-[77px] bg-[#1f1308]  flex items-center  pl-[30px] pr-[30px] rounded-tl-lg">
        <button
          onClick={() => dispatch(setShowProfile(false))}
          className="flex items-center justify-center w-full hover:scale-125 animate-scaleIn"
        >
          <h6 className="text-[18px] text-[#fff] font-semibold text-xl mr-[10px] ">
            Профиль
          </h6>
          <FcHome className="w-[25px] h-[25px] text-[#fff] " />
        </button>
      </div>
      {/* БЛОК данных пользователя */}
      {/* <div className="mb-40 mt-10"> */}
      {/* БЛОК картинка */}
      <div className="flex items-center flex-col  mt-12 animate-scaleIn">
        <label
          htmlFor="imageInput"
          className="items-center h-[150px] rounded-[100%]"
        >
          <img
            className="h-[150px] rounded-[100%] cursor-pointer items-center "
            src={activeUser?.picture}
            alt=""
          />
        </label>
        <input
          className="hidden"
          type="file"
          name="picture"
          id="imageInput"
          accept="image/*"
          onChange={handleChangeImg}
        />
      </div>
      {/* БЛОК данных NAME */}
      <ProfileEdit
        type="name"
        handleChange={handleChange}
        input={formData.name}
        handleSubmit={submitUserName}
        name="Ваше имя"
      />
      {/* БЛОК данных Email */}
      <div className="profile-edit-component flex flex-col py-4 mt-4 bg-customFon shadow-md px-4 gap-y-3 animate-scaleIn">
        <p className="text-[20px] text-green-500 font-extrabold tracking-wide">
          Email
        </p>
        <div className="flex justify-between items-center">
          <p className="text-[16px] text-white w-[70%] font-bold">
            {formData.email}
          </p>
        </div>
      </div>
      {/* </div> */}
      {/* БЛОК выход */}
      <div
        onClick={logoutUser}
        className="flex items-center justify-center text-center cursor-pointer shadow-2xl bg-[#543d27] mt-[120px] hover:scale-125 animate-scaleIn "
      >
        <ImExit className="text-green-500 w-[30px] h-[30px]" />
        <h6 className="text-[25px] text-green-500 font-semibold ml-2 ">
          Выйти
        </h6>
      </div>
      {/* </div> */}
    </div>
  );
}

export default Profile;
