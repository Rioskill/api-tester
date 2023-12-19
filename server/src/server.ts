import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { Tester } from './tester';
import { JSONDeepComparator } from './comparators/deep_comparator';
import { db_controller } from './db_controller';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000; 

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.json())
app.use('/', express.static(path.resolve(__dirname, "../../client/dist/")));

app.get('/', (req, resp) => {
    resp.send(path.resolve(__dirname, "../client/dist/index.html"))
    resp.sendFile(path.resolve(__dirname, "../../client/dist/index.html"));
});

const bodyComparator = new JSONDeepComparator();
const tester = new Tester(bodyComparator);

app.get('/groups', async (req, resp) => {
    const groups = await db_controller.getGroups();

    resp.send(groups);
})

app.post('/groups', async (req, resp) => {
    const group_id = await db_controller.createGroup(req.body.name);

    resp.send({group_id: group_id})
})

app.patch('/groups/:group_id', async (req, resp) => {
    db_controller.updateGroupName(
        parseInt(req.params.group_id),
        req.body.name
    );

    resp.send({status: 'ok'})
})

app.delete('/groups/:group_id', async (req, resp) => {
    db_controller.deleteGroup(parseInt(req.params.group_id))

    resp.send({status: 'ok'})
})

app.post('/group/:group_id/tests', async (req, resp) => {
    const test_id = await db_controller.createTestWithName(
        parseInt(req.params.group_id), 
        req.body.name
    );

    resp.send({test_id: test_id});
})

app.patch('/tests/:test_id', async (req, resp) => {
    db_controller.updateTest({
        id: req.params.test_id,
        ...req.body
    });
    resp.send({status: 'ok'});
})

app.delete('/tests/:test_id', async (req, resp) => {
    db_controller.deleteTest(parseInt(req.params.test_id))

    resp.send(({status: 'ok'}))
})

app.post('/api', async (req, resp) => {
    const {response, result} = await tester.makeTest({
        url: req.body.url,
        method: req.body.method,
        params: req.body.request.params,
        targetBody: req.body.response.body,
        targetStatus: req.body.response.status
    })
    
    resp.send({
        request: req.body,
        response,
        result
    });
});
