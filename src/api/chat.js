import { toast } from 'react-toastify';
import { API } from '../utils'

//создание чата
export const acessCreate = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/chat', body);
    return data;
  } catch (error) {
    console.log('Ошибка создания чата');
  }
};

//Получаем все чаты
export const fetchAllChats = async () => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).get('/api/chat');
    return data;
  } catch (error) {
    console.log('Ошибка получения всех чатов');
  }
};

//Создаем группу в чате
export const createGroup = async (body) => {
  try {
    console.log("createGroup");
    console.log(body);
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/chat/group', body);
    toast.success(`${data.chatName} Группа успешно создана`);
    return data;
  } catch (error) {
    console.log('Ошибка создания группы');
  }
};

//Добавим пользователя в группу 
export const addToGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/group/add', body);
    return data;
  } catch (error) {
    console.log('Ошибка добавления группы');
  }
};

//Переименование группы
export const renameGroup = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/group/rename', body);
    return data;
  } catch (error) {
    console.log('Ошибка переименования группы');
  }
};

//Удаления пользователя из группы
export const removeUser = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).patch('/api/chat/group/remove', body);
    return data;
  } catch (error) {
    console.log('Ошибка удаления пользователя');
  }
};
