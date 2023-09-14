class AuthManager {

    token = "UNINITIALIZED";
    baseURL = "emptyURL";
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

    // Vous pouvez également ajouter d'autres méthodes, comme la vérification d'expiration du token, la déconnexion, etc.
}

module.exports = AuthManager;