const MEMBER_PREFIX = 'member';
const ADMIN_PREFIX = 'admin';

export const state = () => ({
    member: localStorage.getItem(MEMBER_PREFIX) ? JSON.parse(localStorage.getItem(MEMBER_PREFIX)) : false,
    admin: localStorage.getItem(ADMIN_PREFIX) ? JSON.parse(localStorage.getItem(ADMIN_PREFIX)) : false,
    location: {
        latitude: "",
        longitude: ""
    }
});

export const mutations = {
    setMember(state, data) {
        state.member = data;
    },
    
    setAdmin(state, data) {
        state.admin = data;
    },

    setLocation(state, data) {
        state.location = data;
    }
};