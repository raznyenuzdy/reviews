import {applyHumanTime} from '../utils/utils';

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
    parent.children.splice(j, 1);
    model.splice(i, 1);
};

export const applyBlockPermissions = (type, role) => {
    const perms = globalPermissions[type];
    return {
        canReply: !!perms.canReply.find(u => u === role),
        canEdit: !!perms.canEdit.find(u => u === role),
        canDelete: !!perms.canDelete.find(u => u === role),
    }
}

export const adjustLoadedBlock = (block) => {
    if (!block) return {}
    const createdAt = block.createdAt || '';// || new Date().toISOString();
    const updatedAt = block.updatedAt || '';// || new Date().toISOString();
    block.comments?.forEach(c => {
        c.createdAt = new Date(c.createdAt).toString();
        c.updatedAt = new Date(c.updatedAt).toString();
        c.createdAtStr = applyHumanTime(c.createdAt);
        c.modifiedAtStr = applyHumanTime(c.updatedAt);
    });
    return {
        id: block.id,
        parentId: block.ref_parent || '',
        createdAt: new Date(block.createdAt).toString(),
        updatedAt: new Date(block.updatedAt).toString(),
        createdAtStr: applyHumanTime(createdAt),
        modifiedAtStr: applyHumanTime(updatedAt),
        label: block.label || '',
        text: block.text,
        type: applyTypeBlock(block),
        ref_user: block.ref_user,
        approved: block.approved,
        closed: block.closed,
        deleted: block.deleted,
        comments: block.comments || [],
        user_model: block.user_model,
    }
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

const getBlocksDb = async (page/*, grants*/) => {
    try {
        const options = {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'GET',
        }
        // if (grants) header['Authorization'] = `Bearer ${grants.token}`;
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/block/page/${page}`,
            options
        );
        const resp = await response.json();
        //случай поломки базы, если шлет пустоту
        const model = resp.filter(r => !!r);
        return [].concat(model ?? []);
    } catch (error) {
        return []
    }
}