import { useSelector, useDispatch } from "react-redux";
import { setActiveChat, fetchChats } from "../redux/features/chatsSlice";
import { useEffect } from "react";
import { getChatName, getChatPhoto, getTimeLast, getShortText } from "../utils";
import NoContacts from "../ui/NoContacts";

function Contacts() {
  const dispatch = useDispatch();
  const { chats, activeChat } = useSelector((state) => state.chats);
  const activeUser = useSelector((state) => state.activeUser);

  //получение обновление чатов
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <>
      {/* //Блок вывода юзеров с которыми установлен чат */}
      <div className="contact-component flex flex-col -space-y-1 overflow-y-scroll scrollbar-hide h-[730px]">
        {chats?.length > 0 ? (
          chats?.map((e) => {
            return (
              <div
                onClick={() => {
                  dispatch(setActiveChat(e));
                }}
                key={e._id}
                className={`contact-component flex items-center justify-between  rounded-md ${
                  activeChat._id === e._id ? "bg-[#e3bc98]" : "bg-[#fff]"
                } cursor-pointer  py-4 px-2`}
              >
                <div className="flex items-center gap-x-3 ">
                  <img
                    className="contact-component-photo w-12 h-12  rounded-[30px] shadow-lg object-cover"
                    src={getChatPhoto(e, activeUser)}
                    alt=""
                  />
                  <div>
                    <h5 className="contact-component-name-user text-[13.6px] text-[#2b2e33] font-bold">
                      {getChatName(e, activeUser)}
                    </h5>
                    <p className="contact-component-latest-maessage text-[13.6px] font-medium text-[#56585c] ">
                      {getShortText(e)}
                    </p>
                  </div>
                </div>
                <div className="contact-component-date flex flex-col items-end gap-y-[8px]">
                  <p className="text-[12.4px] font-normal text-black tracking-wide">
                    {getTimeLast(new Date(Date.parse(e.updatedAt)))}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <NoContacts />
        )}
      </div>
    </>
  );
}

export default Contacts;
