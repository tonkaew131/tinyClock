const NODE_ENV = process.env.APP_ENV;

module.exports = {
    googleapi: {
        token_path: './secret/google_token.json',
        credential_path: './secret/google_credentials.json'
    },
    shortlink: {
        links_path: './secret/links.json',
        url: ''
    },
    spotify: {
        token_path: './secret/spotify_token.json',
        credential_path: './secret/spotify_credentials.json'
    },
    tmd: {
        token_path: './secret/tmd_token.json'
    },
    api: {
        url: NODE_ENV == 'development' ? 'http://localhost:3000' : ''
    }
}