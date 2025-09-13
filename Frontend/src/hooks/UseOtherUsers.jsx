import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import {useDispatch} from "react-redux";
import { getMyProfile, getOtherUsers } from "../redux/userSlice";

const UseOtherUsers = (id) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchOtherUsers = async () => {
            if (!id) return; // Don't fetch if no id
            try {
                const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`, {
                    withCredentials: true
                });
                if (res.data?.otherUsers) {
                    dispatch(getOtherUsers(res.data.otherUsers));
                } else {
                    dispatch(getOtherUsers([]));
                    console.warn("No other users found for:", id);
                }
            } catch (error) {
                dispatch(getOtherUsers([]));
                console.error("Fetch other users error:", error);
            }
        };
        fetchOtherUsers();
    }, [id, dispatch]);
};
export default UseOtherUsers;