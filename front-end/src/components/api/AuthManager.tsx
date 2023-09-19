class AuthManager {

    token = "UNINITIALIZED";
    constructor() {
        this.token = "";
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    // Vous pouvez également ajouter d'autres méthodes, comme la vérification d'expiration du token, la déconnexion, etc.
}

module.exports = AuthManager;