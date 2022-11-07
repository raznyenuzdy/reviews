import { MinusIcon } from "@chakra-ui/icons";

const viewModel = {
    header: {
        title: {},
        keywords: {},
        description: {}
    },
    body: {
        timeline: []
    }
};


const adTypes = [
    "Ad", "Review", "Response", "Official response", "Comment"
]

const theme = [{
    type: "Ad",
    creators: ["Admin", "Moder"],
    parents: null,
    responders: [
        {
            type: "Guest",
            to: ["Admin", "Moder"]
        }, {
            type: "User",
            to: ["Admin", "Moder"]
        }],
    levels: ["0"],
    views: ["Body"],
}, {
    type: "Review",
    creators: ["User"],
    parents: null,
    responders: [{ type: "Org", after: ["User"] }],
    levels: ["0"],
    views: ["Head", "Type", "Body", "Buttons", "Reviews"],
}, {
    type: "Response",
    creators: [
        {
            type: ["Ad"],
            posts: [{
                at: null,
                who: [{
                    users: ["Moder", "Admin"],
                    after: null
                }]
            }],
        },
        {
            type: ["Review"],
            posts: [{
                at: null,
                who: [{
                    users: ["User"],
                    after: null
                }]
            }]
        },
        {
            type: ["Oficial response"],
            posts: [{
                at: ["Review"],
                who: [{
                    users: ["Org"],
                    after: ["User"]
                }]
            }]
        },
        {
            type: "Response", //type of message
            placed: [{
                at: ["Ad", "Response"], //as reply to what, this message possible
                who: [{ //if who place this message?
                    user: "Guest", //if place guest, then can reply to message created by:
                    after: ["Guest", "Userin"] //by this users
                    //guest can respond on "Ad" or "Response", if it was posted by guest or user
                }, {
                    user: "User",
                    after: ["Guest", "User", "Org"]
                    //user can reply to ad or response, posted by guest, user or org
                }, {
                    user: "Org",
                    after: ["Guest", "User", "Org"]
                }, {
                    user: "Moder",
                    after: ["Guest", "User", "Org", "Moder"]
                }, {
                    user: "Admin",
                    after: ["Guest", "User", "Org", "Moder", "Admin"]
                }]
            }, {
                at: ["Oficial response"],
                who: [{
                    user: ["Guest", "User", "Org", "Moder", "Admin"],
                    after: ["Org"]
                    //all can respond to official response, placed by Org
                }]
            }]
        }, {
            level: [1, 999],
            posts: [{
                at: ["Response"],
                who: [{
                    user: "Guest",
                    after: ["Guest", "User", "Org"]
                }, {
                    user: "User",
                    after: ["Guest", "User", "Org"]
                }, {
                    user: "Org",
                    after: ["Guest", "User", "Org"]
                }, {
                    user: "Moder",
                    after: ["Guest", "User", "Org", "Moder"]
                }, {
                    user: "Admin",
                    after: ["Guest", "User", "Org", "Moder", "Admin"]
                }]
            }]
        }],
    responders: [{
        type: "Guest",
        after: ["Admin", "Moder"]
    }, {
        type: "User",
        after: ["Admin", "Moder"]
    }],
    parent: [
        { type: "Ad", users: ["Admin", "Moder"] },
        { type: "Review", users: ["User"] },
        { type: "Oficial response", users: ["ORG"] }
    ],
    level: ["*"],
    view: ["Body", "Buttons", "Reviews"],
}, {
    type: "Oficial response",
    creators: [{
        at: ["Review"],
        who: [{
            user: "Org",
            after: ["User"]
        }]
    }],
    responders: [{
        type: ["Guest", "User", "Moder", "Admin"],
        after: ["Org"]
    }, {
        type: ["Org"],
        after: ["Admin", "Moder"]
    }],
    view: ["Body", "Buttons", "Reviews"],
    parent: ["Review"],
    level: ["1"]
}]

let globalPermissions = {
    "ad": {
        create: ["admin", "moder"],
        canReply: ["admin", "moder", "user", "guest", "org"],
        canEdit: ["admin", "moder"],
        canEditTimeout: null,//min
        canDelete: ["admin", "moder"],
        canDeleteWithComments: ["admin", "moder"],
    },
    "review": {
        create: ["User"],
        canReply: ["Admin", "Moder", "User", "Org"],
        canEdit: ["Admin", "Moder", "User"],
        canEditTimeout: 5000,//min
        canDelete: ["Admin", "Moder", "User"],
        canDeleteWithComments: ["Admin", "Moder"],
    },
    "org": {
        create: ["Org"],
        canReply: ["Admin", "Moder", "User", "Guest", "Org"],
        canEdit: ["Admin", "Moder", "Org"],
        canEditTimeout: 5000,//min
        canDelete: ["Admin", "Moder", "Org"],
        canDeleteWithComments: ["Admin", "Moder"],
    },
    "reply": {
        create: ["Admin", "Moder", "User", "Guest", "Org"],
        canReply: ["Admin", "Moder", "User", "Guest", "Org"],
        canEdit: ["Admin", "Moder", "User", "Guest", "Org"],
        canEditTimeout: 5000,//min
        canDelete: ["Admin", "Moder", "User", "Guest", "Org"],
        canDeleteWithComments: ["Admin", "Moder"],
    }
}

let block = {
    id: "0",
    parentId: null,
    createdAt: "2022-08-18",
    modifiedAt: "2022-08-18",
    type: "Ad",
    user: {
        userId: "0",
        userType: "Admin",
        firstName: "Jack",
        lastName: "Daniels"
    },
    body: {
        header: null,
        line: null,
        label: "This is the topic of the day",
        text: "First ad article",
        buttons: ["Reply"]
    },
    Permissions: {
        canReply: true
    }
};

let blocks = [
    {
        id: "0",
        createdAt: "2022-08-18",
        modifiedAt: "2022-08-18",
        label: "This is the topic of the day",
        type: {
            type: "Ad",
            // label: "Short story",
            color: "green.500",
            hidden: false
        },
        user: {
            userType: "Admin",
            firstName: "Jack",
            lastName: "Daniels",
        },
        body: {
            header: null,
            line: null,
            text: "First ad article",
        },
        Permissions: {
            canReply: true,
            canEdit: false,
            canDelete: false
        }
    },
    {
        id: "1",
        parentId: null,
        createdAt: "2021-08-16T23:00:33.010+02:00",
        modifiedAt: "2022-08-18",
        type: {
            type: "Review",
            label: null,
            color: "green.500"
        },
        user: {
            userId: "1",
            userType: "User",
            firstName: "Jack",
            lastName: "Daniels",
        },
        header: {},
        body: {
            header: null,
            line: null,
            label: null,
            text: "Box is the most abstract component on top of which all other Chakra UI components are built. By default, it renders a `div` element",
        },
        Permissions: {
            canReply: true,
            canEdit: false,
            canDelete: false
        }
    },
    {
        id: "3",
        parentId: "1",
        createdAt: "2021-08-16T23:00:33.010+02:00",
        modifiedAt: "2022-08-18",
        type: {
            type: "TSP",
            label: "Official response",
            color: "green.500",
        },
        user: {
            userType: "Org",
            firstName: "Paul",
            lastName: "Stockdale",
        },
        header: {},
        body: {
            header: null,
            line: null,
            label: null,
            text: "First comment first child",
        },
        Permissions: {
            canReply: true,
            canEdit: false,
            canDelete: false
        }
    },

];

let model1 = [
    {
        id: "11",
        body: "Box is the most abstract component on top of which all other Chakra UI components are built. By default, it renders a `div` element",
        createdAt: "2021-08-16T23:00:33.010+02:00",
        user: {
            firstName: "Jack",
            lastName: "Daniels",
            userTypeId: "2",
            userType: "User",
            userId: "1",
        },
        type: {
            id: "0",
            label: "This is ad",
        }
    },
    {
        id: "1",
        body: "Box is the most abstract component on top of which all other Chakra UI components are built. By default, it renders a `div` element",
        parentId: null,
        createdAt: "2021-08-16T23:00:33.010+02:00",
        user: {
            firstName: "Jack",
            lastName: "Daniels",
            userTypeId: "2",
            userType: "User",
            userId: "1",
        },
        type: {
            id: "1",
            label: "Review",
        }
    },
    {
        id: "2",
        body: "Second comment",
        parentId: null,
        createdAt: "2021-08-16T23:00:33.010+02:00",
        user: {
            firstName: "John",
            lastName: "Walker",
            userType: "User",
            userTypeId: "2",
            userId: "2",
        },
        type: {
            id: "1",
            label: "Review",
        },
    },
    {
        id: "3",
        body: "First comment first child",
        parentId: "1",
        createdAt: "2021-08-16T23:00:33.010+02:00",
        user: {
            firstName: "Paul",
            lastName: "Manafort",
            userType: "ADVANCE RELOCATION SYSTEMS - MIDDLE RIVER",
            userTypeId: "3",
            userId: "2",
        },
        type: {
            id: "2",
            label: "Official response",
        }
    },
    {
        id: "5",
        body: "Below First comment",
        parentId: "3",
        createdAt: "2021-08-16T23:00:33.010+02:00",
        user: {
            firstName: "Vladyslav",
            lastName: "Volkov",
            userType: "Guest",
            userTypeId: "0",
            userId: "2",
        },
        type: {
            id: "3",
            label: "Guest's comment",
        },
    },
    {
        id: "4",
        body: "Second comment second child",
        parentId: "2",
        createdAt: "2021-08-16T23:00:33.010+02:00",
        user: {
            firstName: "Alex",
            lastName: "Shepard",
            userType: "Guest",
            userTypeId: "0",
            userId: "2",
        },
        type: {
            id: "3",
            label: "Guest's comment",
        },
    },
    {
        id: "1ebxw4lbp",
        body: "tryu",
        parentId: "3",
        createdAt: "2022-08-11T01:13:11.932Z",
        user: {
            firstName: "Jack",
            lastName: "Daniels",
            userType: "User",
            userTypeId: "1",
            userId: "1",
        },
        type: {
            id: "1",
            label: "User's response",
        },
    },
    {
        id: "14bx3flbp",
        body: "Comment to comment",
        parentId: "5",
        createdAt: "2021-08-16T23:00:33.010+02:00",
        user: {
            firstName: "Laura",
            lastName: "Vernimmen",
            userType: "Guest",
            userTypeId: "0",
            userId: "8",
        },
        type: {
            id: "3",
            label: "Guest's comment",
        }
    }
];

export const addComment = async (comment) => {
    model = model.concat(comment);
}

export const getComments = async (user) => {
    const comments = model.filter(obj => obj.parentId === null);
    comments.forEach(comment => {
        comment.canReply = globalPermissions[comment.type?.type].canReply.find(user => user === comment.user.userType) ? true : false;
        comment.canEdit = globalPermissions[comment.type]?.canEdit.find(obj => obj === user.userType);
        comment.canDelete = globalPermissions[comment.type]?.canDelete.find(obj => obj === user.userType);
        comment.canDeleteWithComments = globalPermissions[comment.type]?.canDeleteWithComments.find(obj => obj === user.userType);
        comment.canEditTimeout = globalPermissions[comment.type]?.canEditTimeout.find(obj => obj === user.userType);
        comment.children = model.filter(obj => obj.parentId === comment.id);
    })
    return comments;
};

export const getTheme = async (id) => {
    return theme;
};

export const getReplies = async (id) => {
    const comment = model.find(obj => obj.id === id);
    if (comment) comment.children = model.filter(obj => obj.parentId === id).map(obj => obj.id);
    return comment;
};

export const createBlock = async (Block) => {
    const block = {
        body: Block.body,
        label: Block.label,
        body_type: Block.type,
        ref_user: Block.ref_user,
        ref_user_name: Block.ref_user_name,
    };
    model.push(block);
};

export const createComment = async (text, parentId = null) => {
    const reply = {
        id: Math.random().toString(36).substr(2, 9),
        body: text,
        parentId: parentId,
        userId: "1",
        username: "John",
        createdAt: new Date().toISOString(),
    };
    model.push(reply);
    return reply.id;
};

export const updateComment = async (text) => {
    return { text };
};

export const deleteComment = async (id) => {
    const comment = model.find(obj => obj.id === id);
    const parent = model.find(obj => comment.parentId === obj.id);
    const j = parent.children.findIndex(obj => obj.id === id);
    const i = model.findIndex(obj => obj.id === id);
    console.log(parent.children);
    parent.children.splice(j, 1);
    model.splice(i, 1);
    console.log(parent.children);
};

export const applyBlockPermissions = (type, role) => {
    console.log("applyBlockPermissions:", type, role);
    const perms = globalPermissions[type];
    return {
        canReply: !!perms.canReply.find(u => u === role),
        canEdit: !!perms.canEdit.find(u => u === role),
        canDelete: !!perms.canDelete.find(u => u === role),
    }
}

export const _getBlocks = async (grants) => {
    const comments = model.filter(obj => obj.parentId === null);
    const perms = globalPermissions[comment.type?.type];
    comments.forEach(comment => {
        comment.canReply = perms.canReply.find(user => user === comment.user.userType) ? true : false;
        comment.canEdit = perms.canEdit.find(obj => obj === grants.userType);
        comment.canDelete = perms.canDelete.find(obj => obj === grants.userType);
        comment.canDeleteWithComments = perms.canDeleteWithComments.find(obj => obj === grants.userType);
        comment.canEditTimeout = perms.canEditTimeout.find(obj => obj === grants.userType);
        comment.children = model.filter(obj => obj.parentId === comment.id);
    })
    return comments;
};

export const adjustLoadedBlock = (block) => {
    const createdAt = block.createdAt || '';// || new Date().toISOString();
    const modifiedAt = block.modifiedAt || '';// || new Date().toISOString();
    return {
        id: block.id,
        parentId: block.ref_parent || '',
        createdAt,
        modifiedAt,
        createdAtStr: applyHumanTime(createdAt),
        modifiedAtStr: applyHumanTime(modifiedAt),
        label: block.label || '',
        text: block.text,
        type: applyTypeBlock(block),
        ref_user: block.ref_user,
        approved: block.approved,
        closed: block.closed,
        deleted: block.deleted,
        user_model: block.user_model,//applyUserBlock(block), //здесь ненадо, сервер всё допишет
        // permissions: applyBlockPermissions(block.type, grants.role)
    }
}

const applyHumanTime = (dateStr) => {
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
    console.log(":::::", days, hours, minutes);
    if (days >= 1) {
        const a = [`${days}${labelDays}`];
        if (hours > 0) a.push(`${hours}${labelHours}`);
        return a.join(':');//`${days}${labelDays}:${hours}${labelHours}`;
    }
    if (hours >= 1) {
        return `${hours}${labelHours}:${minutes}${labelMinutes}`;
    }
    if (minutes >= 1) {
        return `${minutes}${labelMinutes}:${Math.floor(
            seconds
        )}${labelSeconds}`;
    }
    return labelMoment;
}

const applyBodyBlock = (block) => {
    return {
        text: block.text,
    }
}

const blockTypes = {
    "ad": "Ad",
    "org": "Official TSP response"
}

const blockRoles = {
    "anonymouse": "Anonymouse",
    "guest": "Guest",
    "user": "User",
    "moder": "Moderator",
    "admin": "Administrator"
}

export const applyUserBlock = (block, grants) => {
    return {
        ref_user: block.ref_user,
        userType: blockRoles[grants.role],
        firstName: grants["first_name"],
        lastName: grants["last_name"],
        nickname: grants["nickname"],
    }
}

const hideBlockLabel = (block) => {
    if (block.type === 'review') {
        return true
    }
    return false;
}

const applyTypeBlock = (block) => {
    return {
        label: block.label,
        type_data: blockTypes[block.type] || '',
        type: block.type,
        color: "green.500",
        hidden: hideBlockLabel(block)
    }
}

export const getBlocks = async (page = 0, grants) => {
    let ret = [];
    const blocks = await getBlocksDb(page, grants);
    blocks.forEach((block) => {
        const done = adjustLoadedBlock(block);
        ret.push(done);
    })
    return ret;
}

const getBlocksDb = async (page, grants) => {
    const options = {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'GET',
    }
    if (grants) header['Authorization'] = `Bearer ${grants.token}`;
    const response = await fetch(
        `http://localhost:5000/api/block/${page}`,
        options
    );
    const resp = await response.json();
    return [].concat(resp ?? []);

    return await [{
        id: 0,
        ref_parent: null,
        ref_user: 1,
        ref_page: 0,
        type: "ad",
        label: "This is the topic of the day",
        text: "Body text",
        createdAt: "2022-09-16T23:00:33.010+02:00",
        modifiedAt: "2022-10-02T23:00:33.010+02:00",
    },{
        "id": 16,
        "ref_user": 2,
        "type": "ad",
        "ref_page": 0,
        "label": "Some kind of label",
        "text": "ewrtwertsdgsdfg",
        "createdAt": "2022-10-16T10:28:41.540Z",
        "updatedAt": "2022-10-16T10:28:41.540Z"
    },
    { "id": 15, "ref_user": 2, "user_model": "{\"id\":2,\"user_id\":\"auth0|631722065d9f46743dcdaf20\",\"email\":\"raznyenuzdy@gmail.com\",\"email_verified\":\"true\",\"name\":\"raznyenuzdy@gmail.com\",\"nickname\":\"raznyenuzdy\",\"picture\":\"https://s.gravatar.com/avatar/258f7074052b071139f76f08ec2d54cb?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fra.png\",\"role\":\"guest\",\"created_at\":\"2022-09-06T10:33:42.343Z\",\"updated_at\":\"2022-10-11T14:41:39.808Z\",\"last_password_reset\":\"2022-09-06T12:12:48.961Z\",\"last_ip\":\"5.90.193.224\",\"last_login\":\"2022-10-11T14:41:39.808Z\",\"logins_count\":\"61\",\"createdAt\":\"2022-10-14T00:46:42.664Z\",\"updatedAt\":\"2022-10-14T00:46:42.664Z\"}", "ref_page": 0, "theme": "", "label": "", "text": "ewrtwertsdgsdfg", "createdAt": "2022-10-16T10:28:41.537Z", "updatedAt": "2022-10-16T10:28:41.537Z" }, { "id": 14, "ref_user": 2, "user_model": "{\"id\":2,\"user_id\":\"auth0|631722065d9f46743dcdaf20\",\"email\":\"raznyenuzdy@gmail.com\",\"email_verified\":\"true\",\"name\":\"raznyenuzdy@gmail.com\",\"nickname\":\"raznyenuzdy\",\"picture\":\"https://s.gravatar.com/avatar/258f7074052b071139f76f08ec2d54cb?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fra.png\",\"role\":\"guest\",\"created_at\":\"2022-09-06T10:33:42.343Z\",\"updated_at\":\"2022-10-11T14:41:39.808Z\",\"last_password_reset\":\"2022-09-06T12:12:48.961Z\",\"last_ip\":\"5.90.193.224\",\"last_login\":\"2022-10-11T14:41:39.808Z\",\"logins_count\":\"61\",\"createdAt\":\"2022-10-14T00:46:42.664Z\",\"updatedAt\":\"2022-10-14T00:46:42.664Z\"}", "ref_page": 0, "theme": "", "label": "", "text": "ewrtwertsdgsdfg", "createdAt": "2022-10-16T10:28:41.529Z", "updatedAt": "2022-10-16T10:28:41.529Z" }, { "id": 13, "ref_user": 2, "user_model": "{\"id\":2,\"user_id\":\"auth0|631722065d9f46743dcdaf20\",\"email\":\"raznyenuzdy@gmail.com\",\"email_verified\":\"true\",\"name\":\"raznyenuzdy@gmail.com\",\"nickname\":\"raznyenuzdy\",\"picture\":\"https://s.gravatar.com/avatar/258f7074052b071139f76f08ec2d54cb?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fra.png\",\"role\":\"guest\",\"created_at\":\"2022-09-06T10:33:42.343Z\",\"updated_at\":\"2022-10-11T14:41:39.808Z\",\"last_password_reset\":\"2022-09-06T12:12:48.961Z\",\"last_ip\":\"5.90.193.224\",\"last_login\":\"2022-10-11T14:41:39.808Z\",\"logins_count\":\"61\",\"createdAt\":\"2022-10-14T00:46:42.664Z\",\"updatedAt\":\"2022-10-14T00:46:42.664Z\"}", "ref_page": 0, "theme": "", "label": "", "text": "346346345646", "createdAt": "2022-10-15T21:30:36.938Z", "updatedAt": "2022-10-15T21:30:36.938Z" }, { "id": 12, "ref_user": 2, "user_model": "{\"id\":2,\"user_id\":\"auth0|631722065d9f46743dcdaf20\",\"email\":\"raznyenuzdy@gmail.com\",\"email_verified\":\"true\",\"name\":\"raznyenuzdy@gmail.com\",\"nickname\":\"raznyenuzdy\",\"picture\":\"https://s.gravatar.com/avatar/258f7074052b071139f76f08ec2d54cb?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fra.png\",\"role\":\"guest\",\"created_at\":\"2022-09-06T10:33:42.343Z\",\"updated_at\":\"2022-10-11T14:41:39.808Z\",\"last_password_reset\":\"2022-09-06T12:12:48.961Z\",\"last_ip\":\"5.90.193.224\",\"last_login\":\"2022-10-11T14:41:39.808Z\",\"logins_count\":\"61\",\"createdAt\":\"2022-10-14T00:46:42.664Z\",\"updatedAt\":\"2022-10-14T00:46:42.664Z\"}", "ref_page": 0, "theme": "", "label": "", "text": "tryurttryu", "createdAt": "2022-10-15T21:30:20.072Z", "updatedAt": "2022-10-15T21:30:20.072Z" }];

/*
    return await [{
        id: 0,
        ref_parent: null,
        ref_user: 1,
        ref_page: 0,
        type: "ad",
        label: "This is the topic of the day",
        text: "Body text",
        createdAt: "2022-09-16T23:00:33.010+02:00",
        modifiedAt: "2022-10-02T23:00:33.010+02:00",
    }, {
        id: 1,
        ref_parent: null,
        ref_user: 1,
        ref_page: 0,
        type: "review",
        label: "Revise my experience",
        text: "Box is the most abstract component on top of which all other Chakra UI components are built. By default, it renders a `div` element",
        createdAt: "2022-09-26T23:00:33.010+02:00",
        modifiedAt: "2022-10-03T23:00:33.010+02:00",
    }, {
        id: 3,
        ref_parent: 1,
        ref_user: 1,
        ref_page: 0,
        type: "org",
        label: "Official response",
        text: "First comment first child",
        createdAt: "2022-09-26T23:00:33.010+02:00",
        modifiedAt: "2022-10-03T23:00:33.010+02:00",
    }]
    */
}

const aa = {
    "id": 16,
    "ref_user": 2,
    "ref_page": 0,
    "theme": "",
    "label": "Some kind of label",
    "text": "ewrtwertsdgsdfg",
    "createdAt": "2022-10-16T10:28:41.540Z",
    "updatedAt": "2022-10-16T10:28:41.540Z"
};