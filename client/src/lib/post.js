async function post(url, data) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (resData.status === 'error') {
        throw new Error(resData.msg);
    } else {
        return resData;
    }
}

export default post;
