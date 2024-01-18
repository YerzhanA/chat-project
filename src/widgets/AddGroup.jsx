import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FcPlus } from "react-icons/fc";
import { RxCross2 } from "react-icons/rx";
import { Modal } from "@mui/material";
import { searchUsers } from "../api/user";
import { createGroup } from "../api/chat";
import { fetchChats } from "../redux/features/chatsSlice";
import Search from "../components/Search";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
function Group({ activeUser }) {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [chatName, setChatName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUsers] = useState([]);

  //Открыть форму
  const handleOpen = () => setOpen(true);
  //Закрыть форму
  const handleClose = () => {
    setOpen(false);
    setSearch("");
    setSelectedUsers([]);
  };

  //Поиск пользователй при вводе в input
  const handleInputSearchUsers = async (e) => {
    setSearch(e.target.value);
  };

  //Добавление пользователя в чат
  const handleClick = (e) => {
    if (selectedUser.includes(e)) {
      return;
    }
    // eslint-disable-next-line react/prop-types
    if (e._id !== activeUser.id) {
      setSelectedUsers([...selectedUser, e]);
    } else {
      toast.warning("Нельзя добавить самого себя!");
    }
  };

  //Удаление пользователя из чата
  const deleteSelected = (element) => {
    setSelectedUsers(selectedUser.filter((e) => e._id !== element._id));
  };

  //Создание группы
  const handleSubmit = async () => {
    console.log(selectedUser);

    if (selectedUser.length >= 2) {
      await createGroup({
        chatName,
        users: JSON.stringify(selectedUser.map((e) => e._id)),
      });
      dispatch(fetchChats());
      handleClose();
    }
  };
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

  useEffect(() => {}, []);

  return (
    <>
      <div
        className=" group-page transition duration-150 ease-in-out"
        onClick={handleOpen}
      >
        <div className="flex ">
          <div className="text-[14px] font-semibold tracking-wide flex items-center gap-x-2 bg-[#382a1e] text-white py-2 pl-4 mb-2  px-2 hover:cursor-pointer rounded-md shadow-md p-4">
            Новая группа <FcPlus className="w-[30px] h-[25px]" />
          </div>
        </div>
      </div>
      {/* //Модальное окно для создания группы */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="group-page-modal absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[400px] bg-white shadow-lg p-8 rounded-md ">
          <h5 className="text-[26px] text-[#30251a] font-extrabold text-center mb-10">
            Создать группу
          </h5>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-y-3 mt-3"
          >
            <input
              onChange={(e) => setChatName(e.target.value)}
              className="border-[#c4ccd5] border-[1px] text-[16px] py-[8px] px-2 w-[100%] rounded-md outline-none focus:outline-none"
              type="text"
              name="chatName"
              placeholder="Имя группы"
              required
            />
            <input
              onChange={handleInputSearchUsers}
              className="border-[#c4ccd5] border-[1px] text-[16px] py-[8px] px-2 w-[100%] rounded-md outline-none focus:outline-none"
              type="text"
              name="users"
              placeholder="Добавить пользователя"
            />
            {/* Блок Удаления пользователей из списка */}
            <div className="flex -mt-2">
              {selectedUser?.map((e) => {
                return (
                  <button
                    key={e._id}
                    onClick={() => deleteSelected(e)}
                    className="flex items-center gap-x-1 bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400"
                  >
                    <span>{e.name}</span>
                    <RxCross2 />
                  </button>
                );
              })}
            </div>
            {/* Блок поиска */}
            <Search
              isLoading={isLoading}
              handleClick={handleClick}
              search={search}
              searchResults={searchResults}
            />

            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmit}
                className="bg-[#382a1e] text-[#fff] text-[15px] font-medium px-3 py-2 tracking-wide rounded-md hover:scale-125"
                type="submit"
              >
                Создать
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default Group;
