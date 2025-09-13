import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import {useDispatch} from "react-redux";
import { getMyProfile } from "../redux/userSlice";

const UseGetProfile = (id) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchMyProfile = async () => {
            if (!id) return; // Don't fetch if no id
            try {
                const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
                    withCredentials: true
                });
                if (res.data?.user) {
                    dispatch(getMyProfile(res.data.user));
                } else {
                    dispatch(getMyProfile(null));
                    console.warn("No user found for profile:", id);
                }
            } catch (error) {
                dispatch(getMyProfile(null));
                console.error("Fetch profile error:", error);
            }
        };
        fetchMyProfile();
    }, [id, dispatch]);
};
export default UseGetProfile;