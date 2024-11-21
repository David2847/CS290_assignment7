// Get the mongoose object
import mongoose from 'mongoose';
import 'dotenv/config';


let connection = undefined;
const USER_CLASS = 'User';
let User = undefined;

/**
 * This function connects to the MongoDB server.
 */
async function connect(){
    try{
        await mongoose.connect(process.env.MONGODB_CONNECT_STRING);
        connection = mongoose.connection;
        console.log("Successfully connected to MongoDB using Mongoose!");
        User = createModel();
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}

function createModel() {
    const userSchema = mongoose.Schema({
        name: {type: String, required: true},
        age: {type: Number, required: true},
        email: {type: String, required: true},
        phoneNumber: {type: Number, required: false}
    });
    return mongoose.model(USER_CLASS, userSchema);
}

const createEntry = async (name, age, email, phoneNumber) => { 
    // Call the constructor to create an instance of the model class Movie
    const user = new User({ name: name, age: age, email: email, phoneNumber: phoneNumber }); 
    // Call save to persist this object as a document in MongoDB 
    return user.save();
  }

async function findUsers(filter) {
    const query = User.find(filter);
    return query.exec();
}

async function updateUser(filter, updateObject) {
    // console.log(updateObject);
    const result = await User.updateOne(filter, { $set: updateObject});
    // get the updated document
    const query = User.find(filter);
    return query.exec();
}

async function deleteByQuery(filter) {
    const result = await User.deleteMany(filter);
    console.log(result);
    return result.deletedCount;
}

const deleteById = async (_id) => {
    const result = await User.deleteOne({ _id: _id });
    return result.deletedCount;
  }

export {connect,
        createEntry,
        findUsers,
        updateUser,
        deleteByQuery,
        deleteById};
