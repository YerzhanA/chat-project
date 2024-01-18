import axios from 'axios';
export const URL = "https://quantico.kz/:9991";
//помещаем в header Authorization
export const API = (token) =>
  axios.create({
    baseURL: URL,
    headers: { Authorization: token },
  });

//Обрезаем текст для выввода
export const getShortText = (e) => {

  return (e.latestMessage?.message.length > 20
    ? e.latestMessage?.message.slice(0, 20) + "..."
    : e.latestMessage?.message)

}


//для вывода сообщений в чат margin динамически
export const isSameSenderMarginLeft = (messages, m, i, userId) => {
  const currentMessage = messages[i];
  const nextMessage = messages[i + 1];

  const isLastMessage = i === messages.length - 1;
  const isSameSender = nextMessage?.sender._id === m.sender._id;
  const isDifferentSender = nextMessage?.sender._id !== m.sender._id;
  const isCurrentUser = currentMessage.sender._id === userId;

  if (isLastMessage && !isCurrentUser) {
    return 0;
  } else if (isSameSender && !isCurrentUser) {
    return 33;
  } else if (isDifferentSender && !isCurrentUser) {
    return 0;
  } else {
    return 'auto';
  }
};


//для вывода сообщений проверка на других пользователей  чтбы выводить их с лева
export const isSameUserMarginTop = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};


//Находим время когда был последний раз
export function getTimeLast(dateMillis) {
  const seconds = Math.floor((new Date() - new Date(dateMillis)) / 1000);

  if (seconds < 60) {
    return seconds + ' сек назад';
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return minutes + ' мин назад';
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return hours + ' час назад';
  }

  const days = Math.floor(hours / 24);

  const currentDate = new Date();
  const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  const targetDay = new Date(currentDay - days * 24 * 60 * 60 * 1000);

  if (currentDate - targetDay < 2 * 24 * 60 * 60 * 1000) {
    // В течение последних двух дней
    return 'вчера';
  }

  return days + ' дней назад';
}

//ЛОГИКА ДЛЯ ПРОВЕРКИ ДАННЫХ

//проверка отправителя для аватарки проверка начала  
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

//последнее сообщение
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};


//ЛОГИКА ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ

//получитель отправиетля
export const getSender = (activeUser, users) => {
  return activeUser.id === users[0]._id ? users[1].name : users[0].name;
};

//получить имя группа это или чат
export const getChatName = (activeChat, activeUser) => {
  return activeChat?.isGroup
    ? activeChat?.chatName
    : activeChat?.users[0]?._id === activeUser.id
      ? activeChat?.users[1]?.name
      : activeChat?.users[0]?.name;
};

//Получить инфу пользователя
export const getChatPhoto = (activeChat, activeUser) => {
  return activeChat?.isGroup
    ? activeChat.photo
    : activeChat?.users[0]?._id === activeUser?.id
      ? activeChat?.users[1]?.picture
      : activeChat?.users[0]?.picture;
};


//получаем оналайн юзера
export const getOnlineUser = (activeChat, activeUser, onlineUser) => {
  const findUser = onlineUser.find((user) => user.id !== activeUser.id);

  if (
    findUser &&
    !activeChat.isGroup &&
    activeChat.users.find((user) => user._id === findUser.id)
  ) {
    return "online";
  } else if (activeChat.isGroup) {
    return "group";
  } else {
    return "offline";
  }
};