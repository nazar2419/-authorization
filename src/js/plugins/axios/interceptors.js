const lsTokenkey = 'my_app_token'; // ключ под которим хранится токен в локал сторач

function setToken(req) {
    console.log(req);
    const isAuthUrl = req.url.includes('auth');

    if (!isAuthUrl) {
        const token = localStorage.getItem(lsTokenkey);
        req.headers['x-access-token'] = token; // ключ для цього сайту для іншого може бути autorization
        // получити токен при любому запиті крім авторизації
    }

    return req;
}

function setTokenOnLogin(res) { // response або передаем reject
    //інтерсептор повинен повертати те що получив із своїми настройками
    const isLoginUrl = res.config.url.includes('login') // перевірка чи є логін в url 
    
    if (isLoginUrl) {
        const token = res.data.token;
        localStorage.setItem(lsTokenkey, token);// сохраняем токен в локал сторач
    }


    return res;
}

function getClearResponse(res) {
    return res.data;
}

function onError(err) {
    console.dir(err);
    return Promise.reject(err);
}
export default function (axios) {
    axios.interceptors.request.use(setToken); // визов на запрос
    axios.interceptors.response.use(setTokenOnLogin); // визов інтерсептора
    axios.interceptors.response.use(getClearResponse, onError);
}