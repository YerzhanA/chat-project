import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  email: '',
  picture: '',
  name: '',
};

const activeUserSlice = createSlice({
  name: 'activeUser',
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.id = action.payload.user._id;
      state.email = action.payload.user.email;
      state.picture = action.payload.user.picture;
      state.name = action.payload.user.name;
    },
    //для отображения имени на фомре
    setUserName: (state, action) => {
      state.name = action.payload.name;
    },
    setPicture: (state, action) => {
      state.picture = action.payload;
    },
  },
});
export const { setActiveUser, setUserName, setPicture } = activeUserSlice.actions;
export default activeUserSlice.reducer;
