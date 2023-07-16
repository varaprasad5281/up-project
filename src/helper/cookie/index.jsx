const getCookie = (name) => {
    const cookie = document.cookie;
    const cookieArr = cookie.split('; ');
    let cookieValue = '';
    cookieArr.forEach((item) => {
        const arr = item.split('=');
        if (arr[0] === name) {
            cookieValue = arr[1];
        }
    });
    return cookieValue;
}

const setCookie = (name, value, expires) => {
    document.cookie = `${name}=${value};expires=${expires}`;
}

const removeCookie = (name) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export {
    getCookie,
    setCookie,
    removeCookie
}
