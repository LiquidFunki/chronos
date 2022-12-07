import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    createCalendar: false,
    editCalendar: false,
    createEvent: false,
    invite: false,
    editEvent: false,
    infoEvent: false,
    infoCalendar: false,
    settings: false
  },
  reducers: {
    settingsOn(state) {
      state.settings = true;
    },
    settingsOff(state) {
      state.settings = false;
    },
    createCalendarOn(state) {
      state.createCalendar = true;
    },
    createCalendarOff(state) {
      state.createCalendar = false;
    },
    editCalendarOn(state) {
      state.editCalendar = true;
    },
    editCalendarOff(state) {
      state.editCalendar = false;
    },
    createEventOn(state) {
      state.createEvent = true;
    },
    createEventOff(state) {
      state.createEvent = false;
    },
    editEventOn(state) {
      state.editEvent = true;
    },
    editEventOff(state) {
      state.editEvent = false;
    },
    infoEventOn(state) {
      state.infoEvent = true;
    },
    infoEventOff(state) {
      state.infoEvent = false;
    },
    infoCalendarOn(state) {
      state.infoCalendar = true;
    },
    infoCalendarOff(state) {
      state.infoCalendar = false;
    },
    inviteOn(state) {
      state.invite = true;
    },
    inviteOff(state) {
      state.invite = false;
    },
  },
});

export const {
  createCalendarOn,
  createCalendarOff,
  createEventOn,
  createEventOff,
  inviteOn,
  inviteOff,
  editCalendarOn,
  editCalendarOff,
  editEventOn,
  editEventOff,
  infoEventOn,
  infoEventOff,
  infoCalendarOn,
  infoCalendarOff,
  settingsOn,
  settingsOff
} = modalSlice.actions;

export default modalSlice.reducer;
