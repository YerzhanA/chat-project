import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { fetchAllChats } from '../../api/chat.js';

const initialState = {
  chats: [],
  activeChat: '',
  isLoading: false,
  notifications: [],
};

export const fetchChats = createAsyncThunk('redux/chats', async () => {
  try {
    const data = await fetchAllChats();
    return data;
  } catch (error) {
    toast.error('Что то пошло не так! Попробуйте снова!');
  }
});

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
  extraReducers: {
    [fetchChats.pending]: (state) => {
      state.isLoading = true;
    },
    [fetchChats.fulfilled]: (state, action) => {
      state.chats = action.payload;
      state.isLoading = false;
    },
    [fetchChats.rejected]: (state) => {
      state.isLoading = false;
    },
  },
});

export const { setActiveChat, setNotifications } = chatsSlice.actions;
export default chatsSlice.reducer;
