const ter = () => {
    const events = new Map();
    const ee = {
        get: (name) => {
            return events.get(name)
        },
        set: (name, ...data) => {
            events.set(name, ...data)
        },
        del: (name) => {
            events.delete(name)
        }
    };
    return ee;
};

const inter = ter();

export default inter;