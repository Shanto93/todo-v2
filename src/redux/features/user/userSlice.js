import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import auth from "./../../../utils/firebase.config";

const initialState = {
  name: "",
  email: "",
  isLoading: true,
  isError: false,
  error: "",
};

export const createUser = createAsyncThunk(
  "userSlice/createUser",
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      // console.log(user);

      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      // console.log(user);

      // console.log(userCredential);

      return {
        email: user.user.email,
        name: user.user.displayName,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.name = payload.name;
      state.email = payload.email;
    },
    toggleLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.name = "";
        state.email = "";
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(createUser.fulfilled, (state, { payload }) => {
        state.name = payload.name;
        state.email = payload.email;
        state.isLoading = false;
        state.isError = false;
        state.error = "";
      })
      .addCase(createUser.rejected, (state, action) => {
        state.name = "";
        state.email = "";
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || "An error occurred during signup.";
      });
  },
});

export const { setUser, toggleLoading } = userSlice.actions;
export default userSlice.reducer;