import { createSlice } from '@reduxjs/toolkit';

export interface OnlineUser {
  id: string;
  name: string;
  email: string;
  nickname?: string;
}

interface OnlineUsersState {
  list: OnlineUser[];
}

const initialState: OnlineUsersState = {
  list: [],
};

const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: { payload: OnlineUser[] }) => {
      state.list = action.payload;
    },
  },
});

export const { setOnlineUsers } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
