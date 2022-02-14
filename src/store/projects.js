import { createSlice } from '@reduxjs/toolkit';

let lastProjectId = 0;
export let lastProjectAdded = 0;

const slice = createSlice({
  name: 'projects',
  initialState: [],
  reducers: {
    projectAdded: (projects, action) => {
      lastProjectAdded = ++lastProjectId;
      projects.push({
        id: lastProjectAdded,
        name: action.payload.name,
      });
    },
  },
});

export const { projectAdded } = slice.actions;
export default slice.reducer;
