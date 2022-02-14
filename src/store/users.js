import { createSlice } from '@reduxjs/toolkit';

let lastUserId = 0;
export let lastUserAdded = 0;

const slice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    userAdded: (users, action) => {
      lastUserAdded = ++lastUserId;
      users.push({
        name: action.payload.name,
        id: lastUserAdded,
      });
    },
  },
});

export const { userAdded } = slice.actions;
export default slice.reducer;
