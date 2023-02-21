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
        c.user_model = typeof c.user_model === 'string' ? JSON.parse(c.user_model) : c.user_model;
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
        position: block.position,
        comments: block.comments || [],
        user_model: typeof block.user_model === 'string' ? JSON.parse(block.user_model) : block.user_model,
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

export const getBlocks = async (count = 0, session = {}, deleted) => {
    try {
        let ret = [];
        const blocks = await getBlocksDb(count, session, deleted);
        if (!blocks?.model) return ret;
        blocks.model.forEach((block) => {
            const done = adjustLoadedBlock(block);
            ret.push(done);
        })
        blocks.model = ret;
        return blocks;
    } catch (error) {
        throw error;
    }
}

const getBlocksDb = async (page, session = {}, deleted = false) => {
    try {
        const options = {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'GET',
        }
        if (deleted) {
            options.headers.showdeleted = 'true';
        }
        if (session?.accessToken) options.headers['Authorization'] = `Bearer ${session.accessToken}`;
        if (session?.idToken) options.headers['idToken'] = session.idToken;
        console.log("URL:", `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/page/next/${page}`);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/page/next/${page}`,
            options
        );
        const resp = await response.json();
        if (response.status !== 200) throw resp;
        // const resp = await httpApi('GET', `/api/block/page/${page}`);
        //случай поломки базы, если шлет пустоту
        const model = resp?.model?.filter(r => !!r) || [];
        resp.model = [].concat(model ?? []);
        console.log();
        console.log(resp);
        return resp
    } catch (error) {
        throw error
        // console.log('ERROR:model:getBlocksDb:', error);
    }
}

export const getPages = async (page = 0) => {
    let ret = [];
    const data = await getPagesDb(page);
    if (!data?.model || !data?.pageData) return ret;
    data.model.forEach((block) => {
        const done = adjustLoadedBlock(block);
        ret.push(done);
    })
    delete data.model;
    return {model:ret, pageData: data};
}

const getPagesDb = async (page) => {
    try {
        const options = {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'GET',
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/page/${page}`,
            options
        );
        const resp = await response.json();
        if (!resp?.model || !resp?.pageData) return [];
        //случай поломки базы, если шлет пустоту
        resp.model = [].concat(resp.model.filter(r => !!r) ?? []);
        return resp;
    } catch (error) {
        console.log('ERROR:model:getBlocksDb:', error);
        return;
    }
}
