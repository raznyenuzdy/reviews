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
export const stillActual = (date, interval = 5) => {
    const d1 = new Date(date).getTime() || 0;
    const d2 = new Date().getTime() || 0;
    console.log(date, d2, d1);
    return d2 - d1 < interval * 60 * 1000;
}