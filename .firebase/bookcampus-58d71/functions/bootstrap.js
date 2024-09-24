
    const app = new Promise((resolve) => {
      setTimeout(() => {
        const port = process.env.PORT;
        const socket = 'express.sock';
        process.env.PORT = socket;
        
        import(`./dist/courses/server/server.mjs`).then(({ app }) => {
          process.env.PORT = port;
          resolve(app());
        });
      }, 0);
    });
exports.handle = (req,res) => app.then(it => it(req,res));
