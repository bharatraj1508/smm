import { combineReducers } from "redux";

import { reducer as auth } from "./auth";
import { reducer as socket } from "./socket";

export const rootReducer = combineReducers({
  auth,
  socket,
});

export type RootState = ReturnType<typeof rootReducer>;
