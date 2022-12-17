const emitter = () => {
    const events = new Map();
    const wrapped = new Map();
    const ee = {
        on: (name, f, timeout = 0) => {
            const event = events.get(name);
            if (event) {
                if (!event.includes(f)) {
                    if (event) event.push(f);
                    else events.set(name, [f]);
                }
            } else {
                events.set(name, [f]);
            }
            if (timeout) setTimeout(() => {
                ee.remove(name, f);
            }, timeout);
        },
        emit: (name, ...data) => {
            const event = events.get(name);
            if (event) event.forEach(f => f(...data));
        },
        propagate: (name, ...data) => {
            let obj = {};
            const newid = keyId();
            obj["name"] = name;
            obj["data"] = data[0];
            obj["keyid"] = oks(data[1]) ? data[1] : newid;
            const writer = JSON.stringify(obj);
            const savedEvent = JSON.parse(appStorage.getItem("inAppEvent"));
            if ((isok(savedEvent) && savedEvent.keyid !== data[1])||(!isok(savedEvent))) {
                appStorage.setItem("inAppEvent", writer);
            }
        },
        emitall: (name, ...data) => {
            ee.emit(name, ...data);
            ee.propagate(name, ...data);
        },
        once: (name, f) => {
            const g = (...a) => {
                ee.remove(name, g);
                f(...a);
            };
            wrapped.set(f, g);
            ee.on(name, g);
        },
        remove: (name, f) => {
            const event = events.get(name);
            if (!event) return;
            let i = event.indexOf(f);
            if (i !== -1) {
                event.splice(i, 1);
                return;
            }
            const g = wrapped.get(f);
            if (g) {
                i = event.indexOf(g);
                if (i !== -1) event.splice(i, 1);
                if (!event.length) events.delete(name);
            }
        },
        clear: name => {
            if (name) events.delete(name);
            else events.clear();
        },
        count: name => {
            const event = events.get(name);
            return event ? event.length : 0;
        },
        total: () => {
            return events.size;
        },
        listeners: name => {
            const event = events.get(name);
            if (event) {
                return event.slice();
            }
            return [];
        },
        names: () => [...events.keys()]
    };
    return ee;
};

const inAppEvent = emitter();

export default inAppEvent;