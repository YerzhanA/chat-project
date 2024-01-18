import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../api/user";
import { addToGroup, removeUser, renameGroup } from "../api/chat";
import { fetchChats } from "../redux/features/chatsSlice";
import { getChatName, getChatPhoto } from "../utils";
import Modal from "@mui/material/Modal";
import Search from "../components/Search";
import GroupUsers from "../components/GroupUsers";
import { toast } from "react-toastify";

function AvatarChat() {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const { activeChat } = useSelector((state) => state.chats);
  const activeUser = useSelector((state) => state.activeUser);

  //Открыть при клике на аватарку
  const handleOpen = () => {
    setOpen(true);
    setName(getChatName(activeChat, activeUser));
  };

  //Закртыть при клике на аватарку
  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setSearchResults([]);
  };

  //Добавление пользователей в чат
  const handleClick = async (e) => {
    if (members.includes(e)) {
      return;
    }
    if (e._id !== activeUser.id) {
      await addToGroup({ userId: e?._id, chatId: activeChat?._id });
      setMembers([...members, e]);
    } else {
      toast.warning("Нельзя добавить самого себя!");
    }
  };

  //Удалить из чата
  const deleteSelected = async (elem) => {
    const res = await removeUser({ chatId: activeChat._id, userId: elem._id });
    if (res._id) {
      setMembers(members.filter((e) => e._id !== elem._id));
      dispatch(fetchChats());
      setOpen(false);
    }
    return;
  };

  //Изменить чат имя
  const updateBtn = async () => {
    if (name) {
      let data = await renameGroup({ chatId: activeChat._id, chatName: name });
      if (data) {
        dispatch(fetchChats());
        setOpen(false);
      }
    }
    setOpen(false);
  };

  //Покинуть группу
  const leaveGroup = async () => {
    const res = await removeUser({
      chatId: activeChat._id,
      userId: activeUser.id,
    });
    if (res._id) {
      dispatch(fetchChats());
      setOpen(false);
    }
    return;
  };

  //нужно для обновления если мы изменили activeUser
  useEffect(() => {
    setMembers(activeChat?.users.map((e) => e));
  }, [activeChat, activeUser]);

  //Поиск пользователей
  useEffect(() => {
    const searchChange = async () => {
      setIsLoading(true);
      const { data } = await searchUsers(search);
      setSearchResults(data);
      setIsLoading(false);
    };
    searchChange();
  }, [search]);

  return (
    <>
      <button onClick={handleOpen}>
        <img
          className="w-[40px] h-[40px] rounded-[25px]"
          alt="Profile Pic"
          src={getChatPhoto(activeChat, activeUser)}
        />
      </button>
      {/* //Блок формы чата или группы */}
      {activeChat?.isGroup ? (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="rounded-[15px]"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto bg-white shadow-custom p-custom p-6 rounded-[15px]">
            {/* //ИМЯ ЧАТА */}
            <h5 className="text-[22px] font-extrabold tracking-wide text-center text-[#523b26] ">
              {getChatName(activeChat, activeUser)}
            </h5>
            <div className="p-4">
              <h6 className="text-[16px] text-[#111b21] tracking-wide font-semibold text-center">
                Пользователи
              </h6>
              {/* //Блок Пользователей в чате */}
              <GroupUsers
                members={members}
                deleteSelected={deleteSelected}
                activeUser={activeUser}
              />
              {/* //Блок Формы отображения имени поиска кнопок */}
              <div>
                <form
                  className="mt-5 flex flex-col gap-y-3"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="border-[#c4ccd5] border-[1px] text-[16px] py-[8px] px-2 w-[100%] outline-none focus:outline-none rounded-md"
                    type="text"
                    name="chatName"
                    placeholder="Имя группы"
                    required
                  />
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    className="border-[#c4ccd5] border-[1px] text-[16px] py-[8px] px-2 w-[100%] outline-none focus:outline-none rounded-md"
                    type="text"
                    name="users"
                    placeholder="Добавить пользователей"
                  />
                </form>

                <Search
                  isLoading={isLoading}
                  handleClick={handleClick}
                  search={search}
                  searchResults={searchResults}
                />

                <div className="flex justify-between mt-10">
                  <button
                    onClick={updateBtn}
                    className="bg-[#0086ea] transition hover:bg-[#00A1C9]  px-6 py-2 text-[16px] tracking-wide text-[#fff] font-semibold rounded-md"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => leaveGroup()}
                    className="bg-[#880808] hover:bg-[#A52A2A] transition delay-150 px-6 py-2 text-[16px] tracking-wide text-[#fff] font-semibold  rounded-md"
                  >
                    Покинуть
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-auto bg-white shadow-custom p-custom rounded-[15px]">
            <div className="w-[450px] h-[450px] flex flex-col items-center justify-center -mt-4">
              <img
                className="w-[150px] h-[150px] rounded-[50%] shadow-2xl mb-[20px]"
                src={getChatPhoto(activeChat, activeUser)}
                alt=""
              />
              <h2 className="text-[25px] tracking-wider font-extrabold text-[#313439] mb-[20px]">
                {getChatName(activeChat, activeUser)}
              </h2>

              <h3 className="text-[20px] font-semibold text-[#268d61]">
                <span className="text-[20px] font-extrabold mr-4 text-[#313439]">
                  email:
                </span>
                {!activeChat?.isGroup &&
                activeChat?.users[0]?._id === activeUser.id
                  ? activeChat?.users[1]?.email
                  : activeChat?.users[0]?.email}
              </h3>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default AvatarChat;
