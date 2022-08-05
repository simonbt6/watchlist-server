const URL = require('url').URL;


module.exports = {
    CheckURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch (err) {
            return false;
        }
    }
}