class AuthManager {

    token = "UNINITIALIZED";
    baseURL = "api";
    constructor() {
        this.token = "";
    }


    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    setBaseURL(url){
        this.baseURL = url;
    }

    getBaseURL(){
        return this.baseURL;
    }
}

module.exports = AuthManager;