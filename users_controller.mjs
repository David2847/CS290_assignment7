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


/*
app.post('/orders', (req, res) => {
    const order = req.body;

    // validate data:
    //      company has at least two characters
    //      quantity is integer greater than zero
    if (Number.isInteger(order.quantity) && order.quantity > 0) {
        if (typeof order.company === 'string' && order.company.length >= 2) {
            // create the order in the model
            const orderObject = model.createOrder(order.company, order.quantity);
            // response is JSON Order object -- see canvas
            const responseObject = {
                "company": order.company,
                "quantity": order.quantity,
                "id": orderObject.id,
                "date": orderObject.date
            };
            res.status(201).json(responseObject);
            return;
        }
    }
    // failure response (.json sends it back while also modifying content-type)
    const responseObject = {"Error": "Invalid request"};
    res.status(400).json(responseObject);
});

app.get('/orders', (req, res) => {
    if (req.query.company === undefined) {
        // respond with all orders
        const responseArray = model.getAllOrders();
        res.status(200).json(responseArray);
    } else {
        // respond with all orders from specific company
        const responseArray = model.getOrdersByCompany(req.query.company);
        res.status(200).json(responseArray);
    }
});

app.get('/orders/:id', (req, res) => {
    let orderObject = model.getOrderByID(req.params.id)
    if (typeof orderObject === 'undefined') {
        orderObject = {"Error": "Not found"};
        res.status(404).json(orderObject);
    } else {
        res.status(200).json(orderObject);
    }
});

app.put('/orders/:id', (req, res) => {
    const order = req.body;

    // validate data:
    //      company has at least two characters
    //      quantity is integer greater than zero
    if (Number.isInteger(order.quantity) && order.quantity > 0) {
        const responseObject1 = model.getOrderByID(req.params.id);
        if (typeof responseObject1 !== 'undefined') {
            responseObject1["quantity"] = order.quantity;
            model.replaceOrderByID(req.params.id, responseObject1);
            res.status(201).json(responseObject1);
            return;
        }
        const responseObject2 = {"Error": "Not found"};
        res.status(400).json(responseObject2);
        return;
    }
    const responseObject3 = {"Error": "Invalid request"};
    res.status(400).json(responseObject3);
});

app.delete('/orders/:id', (req, res) => {
    if (model.deleteOrderByID(req.params.id)) {
        res.status(204).send();
        return;
    };
    const responseObject = {"Error": "Not found"};
    res.status(404).json(responseObject);
});

// Don't change or add anything below this line
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
*/