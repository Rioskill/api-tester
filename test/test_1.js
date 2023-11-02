import express from 'express'

const app = express();
const port = process.env.PORT || 3001; 

app.use(express.json())

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/calc', (req, resp) => {
    // console.log(req)
    const a = parseInt(req.query['a'])
    const b = parseInt(req.query['b'])

    resp.send({sum: a + b});
});
