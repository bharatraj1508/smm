import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BreadcrumbState {
  labels: Record<string, string>;
}

const initialState: BreadcrumbState = {
  labels: {},
};

const breadcrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    setBreadcrumbLabel: (
      state,
      action: PayloadAction<{ segment: string; label: string }>,
    ) => {
      const { segment, label } = action.payload;
      state.labels[segment] = label;
    },
    clearBreadcrumbLabel: (state, action: PayloadAction<string>) => {
      delete state.labels[action.payload];
    },
  },
});

export const { setBreadcrumbLabel, clearBreadcrumbLabel } =
  breadcrumbSlice.actions;
export const reducer = breadcrumbSlice.reducer;
