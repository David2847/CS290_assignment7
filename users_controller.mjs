import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as users from './users_model.mjs';

const app = express();
app.use(express.json())

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    await users.connect(false)
    console.log(`Server listening on port ${PORT}...`);
});

app.post('/users', asyncHandler(async (req, res) => {
    const user = req.body;
    await users.createEntry(user.name, user.age, user.email, user.phoneNumber);
    const responseArray = await users.findUsers({name: user.name});
    const responseObject = responseArray[0];
    res.status(201).json(responseObject);
}))

app.get('/users', asyncHandler(async (req, res) => {
    const query = req.query;
    console.log(req.query);
    const responseArray = await users.findUsers(query);
    res.status(200).json(responseArray);
}))

app.get('/users/:id', asyncHandler(async (req, res) => {
    // console.log(req.params.id);
    const responseArray = await users.findUsers({_id: req.params.id});
    if (responseArray.length === 0) {
        let responseObject = {"Error": "Not found"};
        res.status(404).json(responseObject);
    } else {
        let responseObject = responseArray[0];
        res.status(200).json(responseObject);
    }
}))

app.put('/users/:id', asyncHandler(async (req, res) => {
    const userInfo = req.body // object with stuff to update
    const filter = {_id: req.params.id};
    const responseArray = await users.updateUser(filter, userInfo);
    if (responseArray.length === 0) {
        let responseObject = {"Error": "Not found"};
        res.status(404).json(responseObject);
    } else {
        let responseObject = responseArray[0];
        res.status(200).json(responseObject);
    }
}))

app.delete('/users', asyncHandler(async (req, res) => {
    const filter = req.query;
    const deletedCount = await users.deleteByQuery(filter);
    let responseObject = {"deletedCount": deletedCount};
    res.status(200).json(responseObject);
}));

app.delete('/users/:id', asyncHandler(async (req, res) => {
    // console.log(req.params.id);
    const deletedCount = await users.deleteById(req.params.id);
    if (deletedCount === 1) {
        res.setHeader('Content-Type', 'application/json');
        res.status(204).send();
    } else {
        let responseObject = {"Error": "Not found"};
        res.status(404).json(responseObject);
    }
}))