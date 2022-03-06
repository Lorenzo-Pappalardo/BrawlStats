import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'HEAD'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

const TOKEN = process.env.TOKEN;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const before = new Date().getTime();

  await runMiddleware(req, res, cors);

  return fetch(`https://api.brawlstars.com/v1/players/${encodeURIComponent('#' + req.query.tag)}`, {
    headers: new Headers({ accept: 'application/json', authorization: `Bearer ${TOKEN}` }),
  })
    .then(response => res.json(response.body))
    .catch(error => res.json(error))
    .finally(() => {
      const after = new Date().getTime();
      console.log(`Duration: ${after - before} ms\n`);
    });
};
