import { createSlice } from "@reduxjs/toolkit";

interface SocketState {
  isConnected: boolean;
}

const initialState: SocketState = {
  isConnected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnected(state) {
      state.isConnected = true;
    },
    setDisconnected(state) {
      state.isConnected = false;
    },
  },
});

export const { setConnected, setDisconnected } = socketSlice.actions;
export const reducer = socketSlice.reducer;
