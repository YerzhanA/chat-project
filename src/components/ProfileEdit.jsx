import { useState } from "react";
import { FcOk, FcSupport } from "react-icons/fc";
import "../pages/home.css";

// eslint-disable-next-line react/prop-types
function ProfileEdit({ type, handleChange, input, handleSubmit, name }) {
  const [editable, setEditable] = useState(false);
  const submitButton = () => {
    handleSubmit();
    setEditable(false);
  };

  //Блок изменения имени пользователя
  return (
    <>
      <div className="profile-edit-component flex flex-col py-4 mt-4 bg-customFon shadow-md px-4 gap-y-3 animate-scaleIn ease-in-out">
        <p className="text-[20px] text-green-500 font-extrabold tracking-wide">
          {name}
        </p>
        {!editable ? (
          <div className="flex justify-between items-center">
            <p className="text-[16px] text-white w-[70%] font-bold">{input}</p>

            <button onClick={() => setEditable(!editable)}>
              <FcSupport className="w-[25px] h-[25px] text-white" />
            </button>
          </div>
        ) : (
          <div className="w-[100%]  flex items-center justify-between">
            <div className="w-[100%] pr-2">
              <input
                name={type}
                onChange={handleChange}
                className="w-[100%] text-[16px] text-[#3b4a54] outline-0 font-bold p-1 pl-3 rounded-md"
                type="text"
                value={input}
              />
            </div>
            <div className="flex items-center gap-x-4">
              <button onClick={submitButton}>
                <FcOk className="w-[25px] h-[25px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileEdit;
