module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          publish: [
            {
              provider: "github",
              owner: "dvimoreira",
              private: true,
            }
          ]
        },
        preload: "./electron/preload/index.ts",
      }
    }
  };