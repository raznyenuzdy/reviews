import config from "../startup/config";

export const key = () => Math.random().toString(36).substring(2, 12);

export const userTypes = {
    "anon": {
        userId: "0",
        label: "Anonymouse user"
    },
    "admin": {
        userId: "1",
        label: "Administrator"
    },
    "moder": {
        userId: "2",
        label: "Administrator"
    },
    "user": {
        userId: "3",
        label: "User"
    },
    "guest": {
        userId: "4",
        label: "Guest"
    },
    "org": {
        userId: "5",
        label: "User"
    }
};

//distance between dates < 5min
export const stillActual = (obj, interval = 5) => {
    const dt = obj.updatedAt ? new Date(obj.updatedAt).getTime() || 0 : new Date(obj.createdAt).getTime() || 0;
    const d1 = dt > new Date(obj.createdAt).getTime() || 0 ? dt : new Date(obj.createdAt).getTime() || 0;
    const d2 = new Date().getTime() || 0;
    return d2 - d1 < interval * 60 * 1000;
}

export const buildName = (userdata) => {
    const user = typeof userdata === 'string' ? JSON.parse(userdata) : userdata;
    const a = [];
    if (user?.first_name) a.push(user?.first_name)
    if (user?.last_name) a.push(user?.last_name)
    if (user?.nickname && a.length == 0) a.push(user?.nickname)
    if (user?.email && a.length == 0) a.push(user?.email.split('@')[0])
    if (['admin', 'moder'].find(v => v === user?.role)) a.unshift(userTypes[user.role]?.label || '')
    return a.join(' ');
}

//state
export const countReplies = (state, commentId) => {
    if (!state || !commentId) return 0;
    const blockId = state.model.find(b => b.comments.find(c => c.id === commentId))?.id;
    return _countReplies((state.model.find(b => b.id === blockId) || {}).comments, commentId)
}

export const blockCountReplies = (state, blockId) => {
    if (!state || !blockId) return 0;
    return (((state.model.find(b => b.id === blockId)|| {}).comments || []).length);
}

export const _countReplies = (arr, id) => {
    if (!arr || !id) return 0;
    let summ = 0;
    arr.forEach(a => {
        if (a.ref_parent === id) {
            summ = summ + 1 + _countReplies(arr, a.id);
        }
    })
    return summ;
}

export const applyHumanTime = (dateStr) => {
    // return '2h';
    const labelDays = 'd';
    const labelHours = 'h';
    const labelMinutes = 'm';
    const labelSeconds = 's';
    const labelMoment = 'recently';
    if (!dateStr) return '';
    const date = new Date(dateStr).getTime();
    const today = new Date().getTime();
    let delta = Math.abs(today - date) / 1000;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = delta % 60; // in theory the modulus is not required
    if (days >= 1) {
        const a = [`${days}${labelDays}`];
        if (hours > 0) a.push(`${hours}${labelHours}`);
        return a.join(':');//`${days}${labelDays}:${hours}${labelHours}`;
    }
    if (hours >= 1) {
        const a =[`${hours}${labelHours}`];
        if (minutes > 0) a.push(`${minutes}${labelMinutes}`);
        return a.join(':');
    }
    if (minutes >= config.minimalTimeout) {
        return `${minutes}${labelMinutes}`;
        //:${Math.floor(seconds)}
    }
    return labelMoment;
}