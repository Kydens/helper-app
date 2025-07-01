module.exports = {
  apps: [
    {
      name: "api",
      script: "src/app.js",
      cwd: "./api",
      watch: ["src"],
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
    },
    {
      name: "frontend",
      script: "cmd",
      args: "/c npx nuxi dev",
      //   args: "/c npx nuxt preview", // production
      cwd: "./frontend",
      env: {
        NODE_ENV: "development",
        NITRO_PORT: 3000,
      },
    },
  ],
};
