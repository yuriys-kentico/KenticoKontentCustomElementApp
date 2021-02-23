import compression from 'compression';
import { readFileSync } from 'fs';
import { createServer } from 'https';
import polka from 'polka';
import sirv from 'sirv';

import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;

const dev = NODE_ENV === "development";

const server = polka().use(
  compression({ threshold: 0 }),
  sirv("static", { dev }),
  sapper.middleware({
    session: () => ({}),
  })
);

if (dev) {
  createServer(
    {
      key: readFileSync("src/server.key"),
      cert: readFileSync("src/server.cert"),
    },
    server.handler
  ).listen(PORT);
}

module.exports = server;
