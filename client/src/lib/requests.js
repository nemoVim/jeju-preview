const host = 'http://localhost:2023';
// const host = '';

async function resCheck(res) {
    const resData = await res.json();

    if (resData.status === 'error') {
        throw new Error(resData.msg);
    } else {
        return resData.msg;
    }
}

async function postAndPut(method, path, data) {
    return await resCheck(await fetch(host + path, {
        method: method,
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    }));

}

async function postReq(path, data) {
    return await postAndPut('POST', path, data);
}

async function putReq(path, data) {
    return await postAndPut('PUT', path, data);
}

async function getReq(path) {
    return await resCheck(await fetch(host+path));
}

export {postReq, putReq, getReq};
