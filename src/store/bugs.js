import { createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';

// Slices
const slice = createSlice({
  name: 'bugs',
  initialState: {
    list: [],
    loading: false,
    lastFetch: 0,
  },
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    bugsRequestFailed: (bugs, action) => {
      bugs.loading = false;
    },
    bugsRecieved: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
      bugs.lastFetch = Date.now();
    },
    bugAdded: (bugs, action) => {
      bugs.list.push({
        id: action.payload.id,
        description: action.payload.description,
        resolved: action.payload.resolved,
      });
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((b) => b.id === action.payload.id);
      bugs.list[index].resolved = action.payload.resolved;
    },
    bugAssignedToUser: (bugs, action) => {
      const { id, userId } = action.payload;

      const index = bugs.list.findIndex((b) => b.id === id);
      bugs.list[index].userId = userId;
    },
  },
});
export default slice.reducer;

// Action creators: public facing
export const { bugAdded, bugResolved, bugAssignedToUser, bugsRecieved, bugsRequested, bugsRequestFailed } =
  slice.actions;

const url = '/bugs'; // This should be in a config file

export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  // This "caching" has some issues, hard coded policy, code
  // mixed into actio creator. IMO this is middlewar has some issues, hard coded policy, code
  // mixed into actio creator. IMO this is middleware.
  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');
  if (diffInMinutes < 1) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsRecieved.type,
      onError: bugsRequestFailed.type,
    })
  );
};

export const addBug = (bug) =>
  apiCallBegan({
    url,
    method: 'post',
    data: bug,
    onSuccess: bugAdded.type,
  });

export const resolveBug = (id, resolved) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: 'patch',
    data: { resolved },
    onSuccess: bugResolved.type,
  });

export const assignBug = (id, userId) =>
  apiCallBegan({
    url: `${url}/${id}`,
    method: 'patch',
    data: { userId },
    onSuccess: bugAssignedToUser.type,
  });

// Selector
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (bugs) => {
    return bugs.list.filter((b) => !b.resolved);
  }
);

export const getBugsByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((bug) => bug.userId === userId)
  );
