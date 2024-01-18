// import React from 'react'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setShowNotifications,
  setShowProfile,
} from "../redux/features/profileSlice";
import {
  fetchChats,
  setNotifications,
  setActiveChat,
} from "../redux/features/chatsSlice";
import { setActiveUser } from "../redux/features/activeUserSlice";
import { toast } from "react-toastify";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { AiFillMessage, AiOutlineMessage } from "react-icons/ai";
import "../pages/home.css";
import { searchUsers, validUser } from "../api/user";
import { acessCreate } from "../api/chat.js";
import { getSender } from "../utils/index.js";
import Contacts from "./Contacts";
import AddGroup from "./AddGroup";
import Search from "../components/Search";

// eslint-disable-next-line react/prop-types
function ContactChat({ showNotifications }) {
  const dispatch = useDispatch();

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  const { notifications } = useSelector((state) => state.chats);
  const activeUser = useSelector((state) => state.activeUser);

  //поиск
  const handleSearch = async (e) => {
    setSearch(e.target.value);
  };

  const handleClick = async (e) => {
    //нельзя добавлять себяв чат
    if (e._id !== activeUser.id) {
      await acessCreate({ userId: e._id });
      dispatch(fetchChats());
      setSearch("");
    } else {
      toast.warning("Нельзя добавить самого себя!");
    }
  };

  //Поиск
  useEffect(() => {
    const searchChange = async () => {
      setIsLoading(true);
      const { data } = await searchUsers(search);
      setSearchResults(data);
      setIsLoading(false);
    };
    searchChange();
  }, [search, activeUser]);

  //поулчаем активного юзера
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      dispatch(setActiveUser(data));
    };
    isValid();
  }, [dispatch, activeUser]);

  return (
    <div className="side-bar h-[900px] min-w-[400px] bg-[#ffff] relative rounded-l-lg">
      {/* header */}
      <div className="side-bar-header h-[61px] px-4">
        <a className="h-[61px] flex items-center ml-14" href="/">
          <h3 className="text-[20px] text-[#523b26] font-body font-extrabold hover:scale-125">
            Crazy chat
          </h3>
        </a>
      </div>

      <div className="side-bar-header-btn absolute top-4 right-5 flex items-center gap-x-3">
        <button
          className="side-bar-header-message"
          onClick={() => dispatch(setShowNotifications(!showNotifications))}
        >
          {showNotifications ? (
            <AiFillMessage className="w-[25px] h-[25px] text-[#523b26]" />
          ) : (
            <AiOutlineMessage className="w-[25px] h-[25px] text-[#523b26]" />
          )}
        </button>
        {/* Уведомления */}
        <div
          className={`${
            showNotifications
              ? "overflow-y-scroll border border-[#523b26] rounded-md scrollbar-hide tracking-wide absolute top-10 -left-36 z-10 w-[240px] bg-[#fafafa] px-4 py-2 shadow-2xl"
              : "hidden"
          }`}
        >
          <div className="side-bar-header-message text-[13px] ">
            {!notifications.length && "Нет новых сообщений"}
          </div>
          {notifications.map((e, index) => {
            return (
              <div
                onClick={() => {
                  dispatch(setActiveChat(e.chatId));
                  dispatch(
                    setNotifications(notifications.filter((data) => data !== e))
                  );
                }}
                key={index}
                className="text-[12.5px] text-black px-2 cursor-pointer"
              >
                {e.chatId.isGroup
                  ? `New Message in ${e.chatId.chatName}`
                  : `New Message from ${getSender(activeUser, e.chatId.users)}`}
              </div>
            );
          })}
        </div>
        {/* нажатии кнопки показывает профиль  юзера */}
        <button
          onClick={() => dispatch(setShowProfile(true))}
          className="side-bar-header-profile flex items-center gap-x-1 relative"
        >
          <img
            className="w-[28px] rounded-[25px]"
            src={activeUser.picture}
            alt=""
          />
          <IoIosArrowDown className="w-[14px] h-[14px] text-[#616c76]" />
        </button>
      </div>
      {/* БЛОК Поиска */}
      <div className="side-bar-header-search h-[100%]">
        <div className="side-bar-header-search -mt-6 relative pt-6 px-4">
          <form
            className="side-bar-header-search-form  mb-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              onChange={handleSearch}
              className="side-bar-header-search-form-input w-[99.5%] bg-[#f6f6f6] text-[#111b21] tracking-wider pl-9 pr-4 py-[8px] rounded-[9px] outline-0"
              type="text"
              name="search"
              placeholder="Поиск"
            />
          </form>

          <div className="side-bar-header-search-icon absolute top-[36px] left-[27px]">
            <BsSearch className="text-[#c4c4c5]" />
          </div>
          {/* //БЛОК добавление группы */}
          <AddGroup activeUser={activeUser} />
          {/* БЛОК ПОИСКА при поиске получаем найденных пользователей или скелетон */}
          <div
            style={{ display: search ? "" : "none" }}
            className="search-page h-[780px] absolute z-10 w-[100%] left-[0px] top-[70px] bg-[#fff] flex flex-col gap-y-3 pt-3 px-4"
          >
            <Search
              searchResults={searchResults}
              isLoading={isLoading}
              handleClick={handleClick}
              search={search}
            />
          </div>
        </div>
        {/* БЛОК КОНТАКТОВ */}
        <Contacts />
      </div>
    </div>
  );
}

export default ContactChat;
