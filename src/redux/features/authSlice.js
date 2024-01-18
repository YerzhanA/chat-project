import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { URL } from '../../utils'

//Инициализация state начала
const initialState = {
    user: null,
    token: null,
    isLoading: false,
    status: null,
    formData: null,
}

//Регистрация redux
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (body) => {
        try {
            const { data } = await axios.post(`${URL}/auth/register`, body);
            if (data.token) {
                window.localStorage.setItem('userToken', data.token)
            }
            return data

        } catch (error) {
            console.log(error)
        }
    },
)

//Login redux
export const loginUser = createAsyncThunk('auth/loginUser', async (body) => {
    try {

        const { data } = await axios.post(`${URL}/auth/login`, body);
        //помещаем в localStorage
        if (data.token) {
            window.localStorage.setItem("userToken", data.token)
        }
        return data

    } catch (error) {
        console.log("loginUser" + error)
    }
},
)

//Управлячемм состоянием redux
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    //очистка при выходе из профиля
    reducers: {

    },
    extraReducers: {

        // Register user
        //запрос отпрвлется состояние state
        [registerUser.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        //запрос выполнился состояние state при регистрации
        [registerUser.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.status = action.payload.message;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        //запрос ошибка состояние state
        [registerUser.rejectWithValue]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },
        ///////////Login user
        [loginUser.pending]: (state) => {
            state.isLoading = true
            state.status = null
        },
        //запрос выполнился состояние state при регистрации
        [loginUser.fulfilled]: (state, action) => {
            state.isLoading = false
            //action.payload.message берем из сервера auth.js 
            state.status = action.payload.message
            state.user = action.payload.user
            state.token = action.payload.token
        },
        //запрос ошибка состояние state
        [loginUser.rejectWithValue]: (state, action) => {
            state.status = action.payload.message
            state.isLoading = false
        },
    }
})


//проверяем есть ли токен при обновлении страницы
export const checkIsAuth = (state) => Boolean(state.auth.token)

export default authSlice.reducer