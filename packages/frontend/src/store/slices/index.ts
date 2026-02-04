import { combineReducers } from "redux";

import { reducer as auth } from "./auth";
import { reducer as socket } from "./socket";
import { reducer as breadcrumb } from "./breadcrumb";

export const rootReducer = combineReducers({
  auth,
  socket,
  breadcrumb,
});

export type RootState = ReturnType<typeof rootReducer>;
