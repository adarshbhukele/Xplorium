import { createSlice } from "@reduxjs/toolkit";

const XploriumSlice = createSlice({
  name: "Xplorium",
  initialState: {
    Xploriums: [],   // ✅ empty array instead of null
    refresh: false,
    isActive: true,
    isCreatingPost: false, 
  },
  reducers: {
    getAllXploriums: (state, action) => {
      state.Xploriums = action.payload || [];
    },
    updateXplorium: (state, action) => {
      // ✅ update single post in store after like/bookmark
      const updatedPost = action.payload;
      state.Xploriums = state.Xploriums.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
    },
    deleteXplorium: (state, action) => {
      // ✅ remove post from store after delete
      const id = action.payload;
      state.Xploriums = state.Xploriums.filter((post) => post._id !== id);
    },
    getRefresh: (state) => {
      state.refresh = !state.refresh;
    },
    getIsActive: (state, action) => {
      state.isActive = action.payload;
    },
    setIsCreatingPost: (state, action) => {
      state.isCreatingPost = action.payload;
    },
  },
});

export const {
  getAllXploriums,
  updateXplorium,
  deleteXplorium,
  getRefresh,
  getIsActive,
  setIsCreatingPost,
} = XploriumSlice.actions;

export default XploriumSlice.reducer;
