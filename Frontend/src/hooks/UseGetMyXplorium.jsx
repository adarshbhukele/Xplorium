
import axios from "axios";
import { Xplorium_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllXploriums } from "../redux/XploriumSlice";

const useGetMyXplorium = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.Xplorium);

    const fetchMyXplorium = async () => {
        try {
            const res = await axios.get(`${Xplorium_API_END_POINT}/allUserPosts/${id}`, {
                withCredentials: true
            });
            console.log("All User Posts:", res.data);
            dispatch(getAllXploriums(res.data.UserPosts)); 
        } catch (error) {
            console.error("Fetch My Xplorium Error:", error);
        }
    };

    // useEffect(() => {
    //         fetchMyXplorium();
    // }, [isActive, refresh]);
    useEffect(() => {
    if (!id) return; // 🔑 don’t fire until id is available
    fetchMyXplorium();
  }, [id, isActive, refresh]);

};

export default useGetMyXplorium;

