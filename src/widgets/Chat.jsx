import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsEmojiSmile, BsFillEmojiSmileFill } from "react-icons/bs";
import { fetchMessages, sendMessage, sendImage } from "../api/messages";
import { validUser } from "../api/user";
import io from "socket.io-client";
import "../pages/home.css";
import { fetchChats, setNotifications } from "../redux/features/chatsSlice";
import Loading from "../ui/Loading";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { getChatName, getOnlineUser } from "../utils";
import AvatarChat from "./AvatarChat";
import Messages from "./Messages";
import upload from "../assets/images/img.png";

const SOCKET_API = "https://quantico.kz/:9991";
let socket, selectedChat;

function Chat() {
  const { activeChat, notifications } = useSelector((state) => state.chats);
  const activeUser = useSelector((state) => state.activeUser);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [onlineUser, setOnlineUser] = useState([]);

  //нужен когда пользователь что то вводит "пишет"
  useEffect(() => {
    socket = io(SOCKET_API);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  //Начало отправки и установления сокет юзера
  useEffect(() => {
    socket.emit("setup", activeUser);
    socket.on("connected", (dataUser) => {
      setOnlineUser(dataUser);
      setSocketConnected(true);
    });
  }, [activeUser]);

  //Когда кликаем по юзеру переписке с кеем либо
  useEffect(() => {
    const getMessages = async () => {
      if (activeChat) {
        setLoading(true);
        const data = await fetchMessages(activeChat._id);
        setMessages(data);
        socket.emit("join room", activeChat._id);
        setLoading(false);
      }
      // return;
    };
    getMessages();
    //запоминаем чат чтобы отправить по сокету и чтобы не потчерять activeChat последний
    selectedChat = activeChat;
  }, [activeChat]);

  // Отправка сообщений
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        (!selectedChat || selectedChat._id) !== newMessageRecieved.chatId._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          dispatch(setNotifications([newMessageRecieved, ...notifications]));
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
      dispatch(fetchChats());
    });
  }, [dispatch, messages, notifications]);

  //Валидация Юзера
  useEffect(() => {
    const isValid = async () => {
      const data = await validUser();
      if (!data?.user) {
        window.location.href = "/login";
      }
    };
    isValid();
  }, []);

  ////Блок загрузки страницы
  if (loading) {
    // debugger;
    return (
      <div className="chat-page relative w-[100%] h-[900px] bg-[#fafafa]">
        <Loading />
      </div>
    );
  }

  //Отправка сообщений по сокету
  const handleClickSendMessage = async (e) => {
    if ((e.key === "Enter" || e.type === "click") && message) {
      setMessage("");
      socket.emit("stop typing", activeChat._id);
      //отправка сообщения
      const data = await sendMessage({ chatId: activeChat._id, message });
      socket.emit("new message", data);
      //Обновляем сообщения
      setMessages([...messages, data]);
      //обновляем чаты
      dispatch(fetchChats());
    }
  };

  //  отправки изображения
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setMessage("");
    try {
      const imageData = await sendImage({
        chatId: activeChat._id,
        image: file,
        message: message,
      });

      socket.emit("new message", imageData);
      setMessages([...messages, imageData]);

      dispatch(fetchChats());
    } catch (error) {
      console.error("Error sending image:", error);
    }
  };

  //Ввод сообщения пользователем
  const handleChangeInput = (e) => {
    setMessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", activeChat._id);
    }

    //временнная задержка когда пользователь печатает
    const lastTime = new Date().getTime();
    const time = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTime;
      if (timeDiff >= time && typing) {
        socket.emit("stop typing", activeChat._id);
        setTyping(false);
      }
    }, time);
  };
  return (
    <>
      {/* //Блок Если есть чаты или когда нет */}
      {activeChat ? (
        <div className="chat-page relative w-[100%] h-[900px] bg-[#fafafa] rounded-r-lg">
          {/* //Шапка чата */}
          <div className="header-meaasge flex justify-between items-center px-5  bg-customFon w-[100%]  p-4 text-white rounded-tr-lg">
            <div className=" flex items-center gap-x-[10px]">
              <div className="flex flex-col items-start justify-center">
                <h5 className="text-[17px] font-bold tracking-wide">
                  {getChatName(activeChat, activeUser)}
                </h5>
                <p className="text-[14px] text-[#5DBF4F] font-extrabold">
                  {getOnlineUser(activeChat, activeUser, onlineUser)}
                </p>
              </div>
            </div>
            <div>
              <AvatarChat />
            </div>
          </div>

          {/* //Выводи истории сообщений */}
          <div className="center-message scrollbar-hide w-[100%] h-[92%]  flex flex-col overflow-y-scroll p-2  ">
            {/* //БЛОК Вывода всех сообщений */}
            <Messages typing={isTyping} messages={messages} />
            <div className="ml-6 z-10 font-semibold">
              {isTyping ? "пишет...." : ""}
            </div>
            {/* //выводиться надпись пишет когда второй получатель читает */}
          </div>

          {/* //БЛОК НИЖНЯЯ ЧАСТЬ чата */}
          <div className="bottom-message absolute bottom-[1%] w-full flex flex-col items-center">
            {/* вывод емодзи ДИНАМИЧЕСКИ*/}
            {showPicker && (
              <div className="relative w-[95%] flex justify-end ">
                <Picker
                  className="w-[90%] md:w-[350px] mt-2"
                  data={data}
                  onEmojiSelect={(e) => {
                    setShowPicker(!showPicker);
                    setMessage(message + e.native);
                  }}
                />
              </div>
            )}
            <div className="border-[1px] pl-6 border-[#aabac8] px-1 py-2 w-[99%] h-[50px] rounded-md flex  justify-between items-center">
              <form
                className="w-[90%] "
                onKeyDown={(e) => handleClickSendMessage(e)}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  onChange={handleChangeInput}
                  className="focus:outline-0 w-[100%] bg-[#f8f9fa]"
                  type="text"
                  name="message"
                  placeholder="Введите сообщение"
                  value={message}
                />
              </form>

              {/* БЛОК картинка добавить */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="cursor-pointer w-9 h-9 mr-4"
              >
                <img className=" h-9" src={upload} alt="" />
              </label>
              {/* //БЛОК emoji */}
              <div
                className="cursor-pointer"
                onClick={() => setShowPicker(!showPicker)}
              >
                {showPicker ? (
                  <BsFillEmojiSmileFill className="w-7 h-7 text-[#ffb02e] border-[black]" />
                ) : (
                  <BsEmojiSmile className="w-7 h-7 " />
                )}
              </div>
              <button
                onClick={(e) => handleClickSendMessage(e)}
                className="flex border-[2px] font-extrabold border-black hover:bg-black hover:text-white text-[14px] px-6 py-[6px] text-black rounded-[7px] ml-4 bg-[#ab896a]"
              >
                {/* <img className="w-8 h-8" src={send} alt="" /> */}
                Отправить
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-page relative h-[900px]  bg-[#fafafa] rounded-r-lg animate-scaleIn">
          <div className="relative">
            <div className="chat-page-avatar absolute top-[30vh] left-[35%] flex flex-col items-center justify-center gap-y-3 animate-scaleIn">
              <img
                className="w-[200px] h-[200px] rounded-[25px] mb-10"
                alt="User profile"
                src={activeUser.picture}
              />
              <h3 className="chat-page-txt text-[#111b21] text-[22px] font-medium tracking-wider">
                Добро пожаловать
                <span className="chat-page-txt  text-[#664629] text-[25px] font-bold pl-2">
                  {activeUser.name}
                </span>
              </h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
