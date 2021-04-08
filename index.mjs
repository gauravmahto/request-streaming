import express from 'express';

const { static: eStatic } = express;

const app = express();
const port = 8082;

app.use(eStatic('static'));

app.post('/input-data', (req, res, next) => {

  req.setEncoding('utf8');
  req.rawBody = '';

  res.set('Content-Type', 'text/plain; charset=utf-8');

  req.on('data', function (chunk) {
    req.rawBody += chunk;
  });

  req.on('end', function () {

    console.log(req.rawBody);

    res.status(200);
    res.send(req.rawBody);

    next();

  });

  req.on('error', () => {

    res.status(500);
    res.end();

    next();

  });

  req.on('close', () => {

    res.status(500);
    res.end();

    next();

  });

});

app.listen(port, () => console.log(`Server started on port ${port}.`));
