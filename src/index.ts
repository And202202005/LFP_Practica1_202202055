import express from 'express';
import analyzeRouter from './routes/analyze.route';
import appRouter from './routes/applications.route';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.text());

app.use(appRouter);
app.use(analyzeRouter);

app.listen(PORT, () => {
    console.log('The server is running on http://localhost:${PORT}');
});
