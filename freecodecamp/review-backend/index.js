import app from './server.js';
import mongodb from "mongodb";
import ReviewsDAO from "./dao/reviewsDAO.js";

const MongoClient = mongodb.MongoClient;
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;
const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.fbi1tzw.mongodb.net/?retryWrites=true&w=majority`;

const port = 8000;

MongoClient.connect(
    uri,
    // If MongoServerSelectionError occurs, try this options parameters
    // {
    //     seUnifiedTopology: true,
    //     useNewUrlParser: true,
    //     maxIdleTimeMS: 270000,
    //     minPoolSize: 2,
    //     maxPoolSize: 4
    // },
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true,
    }
)
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
    })

    .then(async client => {
        await ReviewsDAO.injectDB(client)
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    });