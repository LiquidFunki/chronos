import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

import api from '../http';
import {
  getActiveCalendars,
  getHiddenCalendars,
  updateCalendarsUtil,
} from '../utils/calendar.utils';
import { API_URL } from '../utils/constants';
import { errorHandler } from '../utils/errorHandler';

export const getAllCalendars = createAsyncThunk(
  'calendar/getAllCalendars',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/calendar/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCalendar = createAsyncThunk(
  'post/getCalendar',
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/calendar/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMainCalendar = createAsyncThunk(
  'post/getMainCalendar',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/calendar/main`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCalendar = createAsyncThunk(
  'calendar/createCalendar',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/calendar`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCalendar = createAsyncThunk(
  'calendar/updateCalendar',
  async (
    { _id, name, description, isHidden, isPublic },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`${API_URL}/calendar/${_id}`, {
        name,
        description,
        isHidden,
        isPublic,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCalendar = createAsyncThunk(
  'calendar/deleteCalendar',
  async ({ id }, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/calendar/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteParticipant = createAsyncThunk(
  'calendar/deleteParticipant',
  async ({ id }, { rejectWithValue }) => {
    try {
      await api.delete(`${API_URL}/calendar/participant/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const acceptCalendarInvite = createAsyncThunk(
  'calendar/acceptCalendarInvite',
  async ({ key }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/calendar/acceptInvite/${key}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState: {
    allCalendars: [],
    activeCalendars: [],
    hiddenCalendars: [],
    currentCalendar: {
      name: '',
      description: '',
      isPublic: true,
    },
    error: null,
    isLoading: false,
    calendarLoading: false,
    success: false,
  },
  reducers: {
    setSuccessFalse(state) {
      state.success = false;
    }
  },
  extraReducers: {
    [getAllCalendars.pending]: (state) => {
      state.isLoading = true;
    },
    [acceptCalendarInvite.pending]: (state) => {
      state.isLoading = true;
    },
    [getCalendar.pending]: (state) => {
      state.calendarLoading = true;
      state.error = null;
    },
    [getMainCalendar.pending]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [createCalendar.pending]: (state) => {
      state.isLoading = true;
      state.success = false;
    },
    [getAllCalendars.fulfilled]: (state, action) => {
      state.allCalendars = action.payload;
      state.activeCalendars = getActiveCalendars(action.payload);
      state.hiddenCalendars = getHiddenCalendars(action.payload);
      state.isLoading = false;
    },
    [getCalendar.fulfilled]: (state, action) => {
      state.currentCalendar = action.payload;
      state.calendarLoading = false;
    },
    [getMainCalendar.fulfilled]: (state, action) => {
      state.currentCalendar = action.payload;
      state.isLoading = false;
    },
    [acceptCalendarInvite.fulfilled]: (state) => {
      toast.success('Invite has been successfully accepted!');
      state.isLoading = false;
    },
    [createCalendar.fulfilled]: (state, action) => {
      toast.success('Calendar has been successfully created!');
      state.activeCalendars = [...state.activeCalendars, action.payload];
      state.isLoading = false;
      state.success = true;
    },
    [deleteCalendar.fulfilled]: (state, action) => {
      const id = action.payload;
      state.allCalendars = state.allCalendars.filter((item) => item._id !== id);
      state.activeCalendars = getActiveCalendars(state.allCalendars);
      state.hiddenCalendars = getHiddenCalendars(state.allCalendars);
      state.isLoading = false;
    },
    [deleteParticipant.fulfilled]: (state, action) => {
      const id = action.payload;
      state.allCalendars = state.allCalendars.filter((item) => item._id !== id);
      state.activeCalendars = getActiveCalendars(state.allCalendars);
      state.hiddenCalendars = getHiddenCalendars(state.allCalendars);
      state.isLoading = false;
    },
    [updateCalendar.fulfilled]: (state, action) => {
      toast.success('Calendar has been successfully updated!');
      state.currentCalendar = action.payload;
      state.allCalendars = updateCalendarsUtil(state.allCalendars, action.payload);
      state.activeCalendars = getActiveCalendars(state.allCalendars);
      state.hiddenCalendars = getHiddenCalendars(state.allCalendars);
      state.isLoading = false;
      state.success = true;
    },
    [getAllCalendars.rejected]: errorHandler,
    [acceptCalendarInvite.rejected]: errorHandler,
    [getCalendar.rejected]: (state, action) => {
      state.calendarLoading = false;
      state.error = action.payload.message;
      console.log('req error: ', action.payload);
    },
    [getMainCalendar.rejected]: errorHandler,
    [createCalendar.rejected]: errorHandler,
    [updateCalendar.rejected]: errorHandler,
  },
});

export const { setSuccessFalse } = calendarSlice.actions;

export default calendarSlice.reducer;
