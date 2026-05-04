const jsonServer = require('json-server');
const auth = require('json-server-auth');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Bind the router db to the app for json-server-auth
server.db = router.db;

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add auth middleware
server.use(auth);

// Use default router
server.use(router);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`JSON Server with Auth is running on http://localhost:${PORT}`);
});
