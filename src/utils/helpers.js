
// components/WithTitle.tsx
import {useEffect} from 'react';
import {useLocation} from "react-router";

const getAvatar = (photo = null) => {
     return import.meta.env.VITE_BACKEND_URL + '/' + (photo ?? "public/default-avatar.jpg")
};

const viewInfluencerLink = (id) => {
     return `/questioner/view-influencer?answerer_id=${id}`
}

export const questionStatusFilterOptions = [
    {value: '', label: 'All Questions'},
    {value: 0, label: 'Pending'},
    {value: 1, label: 'Answered'},
    {value: 2, label: 'Expired'},
];

export { getAvatar, viewInfluencerLink };
