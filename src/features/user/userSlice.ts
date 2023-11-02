import { createSlice } from "@reduxjs/toolkit";
const initialState : any = {
    email : '',
    username : '',
    token : '',
}
const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        userAdded(state, action) {
            state.email = action.payload.email
            state.username = action.payload.username
            state.token = action.payload.token
        }
    }
})
export const {userAdded} = userSlice.actions
export default userSlice.reducer