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
    {value: 3, label: 'Not Paid'},
];

export const questionStatusBadgeOptions = {
    0: {text: 'Pending', variant: 'warning'},
    1: {text: 'Answered', variant: 'success'},
    2: {text: 'Expired', variant: 'secondary'},
    3: {text: 'Not Paid', variant: 'danger'},
};

export {getAvatar, viewInfluencerLink};
