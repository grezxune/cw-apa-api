const path = require('path');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';

const readConfigFile = () => {
    fs.readFile(path.join(__dirname, `.config.${env}.json`), 'utf-8', (err, data) => {
        if (!err) {
            const fileConfigs = JSON.parse(data);

            process.env.TOKEN_SECRET = fileConfigs.TOKEN_SECRET;
        } else {
            console.log(`Error parsing settings file for ${env} environment`, err);
        }
    });
};

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/cw-apa';
    process.env.ALLOWED_ORIGIN = 'http://localhost:8080';
    readConfigFile();
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/cw-apa-test';
    process.env.ALLOWED_ORIGIN = 'http://localhost:8080';
    readConfigFile();
}

console.log('Envs: ', process.env);