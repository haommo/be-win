module.exports = {
  apps : [{
    name: "wingo app",
    script: "ENV_PATH=/var/www/html/.env node ./build/server.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}