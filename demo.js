const { MongoClient } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://mbuser:mbarreiro@cluster0.hong0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try{
        await client.connect(); //this returns a promise

        await listDatabases(client);
    } catch (e) {
        console.error(e)
    } finally {
        await client.close();
    }
    
}

main().catch(console.error);

async function listDatabases(client){
    //list out the databases available for testing
    const databasesList = await client.db().admin().listDatabases();
    console.log("Datavases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}