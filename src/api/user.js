import { toast } from 'react-toastify';
import { API } from '../utils'

//Проверка на пользователя
export const validUser = async () => {
    try {
        const token = localStorage.getItem('userToken');/////********* */
        const { data } = await API(token).get(`/auth/valid`, {
            headers: { Authorization: token },
        });
        return data;
    } catch (error) {
        console.log('Ощибка получения Токена!');
    }
};

//Поиск ПОльзователя
export const searchUsers = async (id) => {
    try {
        const token = localStorage.getItem('userToken');
        return await API(token).get(`/api/user?search=${id}`);
    } catch (error) {
        console.log('Ошибка поиска пользователя');
    }
};

//Изменение пользователя
export const updateUser = async (id, body) => {
    try {
        const token = localStorage.getItem('userToken');
        const { data } = await API(token).patch(`/api/users/update/${id}`, body);
        console.log(data.picture)
        return data;
    } catch (error) {
        toast.error('Что то пошло не так!');
    }
};

//Изменение картинки
export const updatePicture = async (id, body) => {
    try {
        const token = localStorage.getItem('userToken');
        const { data } = await API(token).patch(`/api/users/update/picture/${id}`, body);
        console.log(data.picture)
        return data.picture;
    } catch (error) {
        toast.error('Что то пошло не так!');
    }
};

//Проверка на сущестовавание пользователя
export const checkValid = async () => {
    const data = await validUser();
    if (!data?.user) {
        window.location.href = '/login';
    } else {
        window.location.href = '/chats';
    }
};
