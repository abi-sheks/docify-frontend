import { createSlice } from "@reduxjs/toolkit";
const initialState : any = {}
const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        userAdded(state, action) {
            state.email = action.payload.email
            state.username = action.payload.username
        }
    }
})
export const {userAdded} = userSlice.actions
export default userSlice.reducer