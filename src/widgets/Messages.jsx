/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import {
  isSameSender,
  isSameSenderMarginLeft,
  isSameUserMarginTop,
  isLastMessage,
} from "../utils";

function Messages({ messages, typing }) {
  const activeUser = useSelector((state) => state.activeUser);
  const [hoveredMessage, setHoveredMessage] = useState(null);

  if (messages.length > 0 && messages[0].sender?._id !== activeUser._id) {
    typing = false;
  }

  //  вывод сообщений в чате
  return (
    <>
      <ScrollableFeed className="message-chat scrollbar-hide bg-[url('./assets/images/fon2.jpg')]">
        {messages &&
          messages.map((m, i) => (
            <div
              className="message-chat-row flex items-center gap-x-[6px]"
              key={m._id}
            >
              {/* вывод аватарки и имени пользовтаеля */}
              {(isSameSender(messages, m, i, activeUser.id) ||
                isLastMessage(messages, i, activeUser.id)) && (
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredMessage(m._id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  <img
                    className="w-[45px] h-[45px] cursor-pointer"
                    src={m.sender?.picture}
                    alt=""
                  />

                  {hoveredMessage === m._id && (
                    <div className="z-10 absolute bottom-[-20px] left-0 right-0 mx-auto  rounded-[50%] text-[14px] font-bold p-1 text-slate-500">
                      {m.sender.name.split(" ")[0].charAt(0).toUpperCase() +
                        m.sender.name.split(" ")[0].slice(1)}
                    </div>
                  )}
                </div>
              )}

              {/* //вывод текста и картинки*/}
              {m.message.indexOf("http") ? (
                <span
                  className="message-chat-row-messages tracking-wider text-[15px]  font-medium p-2 md:p-4"
                  style={{
                    backgroundColor: `${
                      m.sender._id === activeUser.id ? "#382a1e" : "#f0f0f0"
                    }`,
                    marginLeft: isSameSenderMarginLeft(
                      messages,
                      m,
                      i,
                      activeUser.id
                    ),
                    marginTop: isSameUserMarginTop(
                      messages,
                      m,
                      i,
                      activeUser.id
                    )
                      ? 3
                      : 10,
                    borderRadius: `${
                      m.sender._id === activeUser.id
                        ? "10px 10px 0px 10px"
                        : "10px 10px 10px 0"
                    }`,
                    color: `${
                      m.sender._id === activeUser.id ? "#ffff" : "#382a1e"
                    }`,
                  }}
                >
                  {m.message}
                </span>
              ) : (
                <span
                  className="message-chat-row-messages tracking-wider text-[15px]  font-medium p-2 md:p-4"
                  style={{
                    backgroundColor: `${
                      m.sender._id === activeUser.id ? "#21170e" : "#f0f0f0"
                    }`,
                    marginLeft: isSameSenderMarginLeft(
                      messages,
                      m,
                      i,
                      activeUser.id
                    ),
                    marginTop: isSameUserMarginTop(
                      messages,
                      m,
                      i,
                      activeUser.id
                    )
                      ? 3
                      : 10,
                    borderRadius: `${
                      m.sender._id === activeUser.id
                        ? "10px 10px 0px 10px"
                        : "10px 10px 10px 0"
                    }`,
                    color: `${
                      m.sender._id === activeUser.id ? "#ffff" : "#848587"
                    }`,
                  }}
                >
                  <img
                    className="max-h-200"
                    src={m.message}
                    alt={`Selected Image ${m.message}`}
                  />
                </span>
              )}
            </div>
          ))}
      </ScrollableFeed>
    </>
  );
}

export default Messages;
