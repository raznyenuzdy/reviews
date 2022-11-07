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
    "Ad": {
        create: ["Admin", "Moder"],
        canReply: ["Admin", "Moder", "User", "Guest", "Org"],
        canEdit: ["Admin", "Moder"],
        canEditTimeout: null,//min
        canDelete: ["Admin", "Moder"],
        canDeleteWithComments: ["Admin", "Moder"],
    },
    "Review": {
        create: ["User"],
        canReply: ["Admin", "Moder", "User", "Org"],
        canEdit: ["Admin", "Moder", "User"],
        canEditTimeout: 5000,//min
        canDelete: ["Admin", "Moder", "User"],
        canDeleteWithComments: ["Admin", "Moder"],
    },
    "TSP": {
        create: ["Org"],
        canReply: ["Admin", "Moder", "User", "Guest", "Org"],
        canEdit: ["Admin", "Moder", "Org"],
        canEditTimeout: 5000,//min
        canDelete: ["Admin", "Moder", "Org"],
        canDeleteWithComments: ["Admin", "Moder"],
    },
    "Reply": {
        create: ["Admin", "Moder", "User", "Guest", "Org"],
        canReply: ["Admin", "Moder", "User", "Guest", "Org"],
        canEdit: ["Admin", "Moder", "User", "Guest", "Org"],
        canEditTimeout: 5000,//min
        canDelete: ["Admin", "Moder", "User", "Guest", "Org"],
        canDeleteWithComments: ["Admin", "Moder"],
    }
}

let userTypes = {
    "Anon": {
        userId: "0",
        label: "Anonymouse user"
    },
    "Admin": {
        userId: "1",
        label: "Administrator"
    },
    "Moderator": {
        userId: "2",
        label: "Administrator"
    },
    "User": {
        userId: "3",
        label: "User"
    },
    "Guest": {
        userId: "4",
        label: "Guest"
    },
    "Org": {
        userId: "5",
        label: "User"
    }
};

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

let model = [
    {
        id: "0",
        parentId: null,
        createdAt: "2022-08-18",
        modifiedAt: "2022-08-18",
        type: {
            label: "This is the topic of the day",
            type: "Ad",
            color: "green.500",
            hidden: false
        },
        user: {
            userType: "Admin",
            firstName: "Jack",
            lastName: "Daniels",
            nickname: "JD"
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
    console.log("MODEL:", user);
    const comments = model.filter(obj => obj.parentId === null);
    comments.forEach(comment => {
        comment.canReply = globalPermissions[comment.type?.type].canReply.find(user => user === comment.user.userType) ? true : false;
        console.log("CANRE:", comment.canReply);
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
    return new Promise((resolve => {
        setTimeout(() => {
            const comment = model.find(obj => obj.id === id);
            if (comment) comment.children = model.filter(obj => obj.parentId === id).map(obj => obj.id);
            resolve(comment);
        }, 5)
    }))
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
    console.log("CCC:", id, comment);
    const parent = model.find(obj => comment.parentId === obj.id);
    const j = parent.children.findIndex(obj => obj.id === id);
    const i = model.findIndex(obj => obj.id === id);
    console.log(parent.children);
    parent.children.splice(j, 1);
    model.splice(i, 1);
    console.log(parent.children);
};
