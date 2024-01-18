import { API } from '../utils'

//Отправка сообщений
export const sendMessage = async (body) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).post('/api/message/', body);
    return data;
  } catch (error) {
    console.log('ошибка отправки sendmessage api' + error);
  }
};

// метод отправки изображения
export const sendImage = async ({ chatId, image, message }) => {
  try {
    const formData = new FormData();
    formData.append('chatId', chatId); // Добавляем chatId в FormData
    formData.append('image', image);
    formData.append('message', message);

    const token = localStorage.getItem('userToken');
    const response = await API(token).post(`/api/message/image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data
  } catch (error) {
    console.error('Ошибка при отправке изображения:', error);
    throw error;
  }
};


//Получить сообщения
export const fetchMessages = async (id) => {
  try {
    const token = localStorage.getItem('userToken');
    const { data } = await API(token).get(`/api/message/${id}`);
    return data;
  } catch (error) {
    console.log('Ошибка получения Message API ' + error);
  }
};
