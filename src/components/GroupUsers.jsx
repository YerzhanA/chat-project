/* eslint-disable react/prop-types */
import { RxCross2 } from "react-icons/rx";

//Отображает пользователей в чате
function GroupUsers({ members, activeUser, deleteSelected }) {
  return (
    <div className="flex justify-between p-4">
      {members.length > 0 &&
        members?.map((e) => (
          <div
            key={e._id}
            className="flex items-center gap-x-1 bg-green-100 text-green-800 text-xs font-medium  px-2.5 py-1 rounded dark:bg-gray-700 dark:text-green-400 border border-[#523b26]"
          >
            <span className="text-[10px] pr-2">
              {e._id === activeUser.id ? "You" : e.name}
            </span>
            <RxCross2
              className="cursor-pointer"
              onClick={() => deleteSelected(e)}
            />
          </div>
        ))}
    </div>
  );
}

export default GroupUsers;
