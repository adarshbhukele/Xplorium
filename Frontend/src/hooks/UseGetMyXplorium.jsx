import axios from "axios";
import { Xplorium_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllXploriums } from "../redux/XploriumSlice";

const useGetMyXplorium = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.Xplorium);

    const fetchMyXplorium = async () => {
        if (!id) return;
        try {
            const res = await axios.get(`${Xplorium_API_END_POINT}/allUserPosts/${id}`, {
                withCredentials: true
            });
            if (res.data?.posts) {
                dispatch(getAllXploriums(res.data.posts));
            } else {
                dispatch(getAllXploriums([]));
                console.warn("No posts found for user:", id);
            }
        } catch (error) {
            dispatch(getAllXploriums([]));
            console.error("Fetch My Xplorium Error:", error);
        }
    };

    useEffect(() => {
        fetchMyXplorium();
    }, [id, isActive, refresh, dispatch]);
};

export default useGetMyXplorium;

