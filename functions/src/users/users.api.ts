import express from 'express';
import cors from 'cors';

import * as usersHandler from './users.handler';
// import validateToken from '../utils/authMiddleware';

export const functions = express();
functions.use(cors({ origin: true }));
// functions.use(validateToken);

functions.get('/search', (req, res) => {
  console.log('Users API - Search Users');

  const {
    filterField,
    filterValue,
    orderField,
    orderDirection,
    page,
    pageSize
  } = req.query;

  if(!orderField || !orderDirection || !page || !pageSize ||
    isNaN(parseInt(`${page}`)) || isNaN(parseInt(`${pageSize}`))
  ) {
    res.status(400).send({ message: 'Missing or incorrect params'});
  } else {
    usersHandler.searchUsers({
      filterField: filterField as string,
      filterValue: filterValue as string,
      orderField: orderField as string,
      orderDirection: orderDirection === 'desc' ? 'desc' : 'asc',
      page: parseInt(`${page}`),
      pageSize: parseInt(`${pageSize}`)
    }).then((users: any) => {
      res.send(users);
    }).catch((err: any) => {
      res.status(500).send(err);
    });
  }
});
