import 'dotenv/config';
import express from 'express';

const app = express();

app.listen(process.env.APP_PORT || 5000, () => {
  console.log(`Server started on port ${process.env.APP_PORT || 5000}!`);
});
