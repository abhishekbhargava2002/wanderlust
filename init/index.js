const mongoose = require("mongoose");
const initData =  require("./data.js");
const Listing = require("../models/listing.js");

//Database connection
main() 
    .then(() => {
        console.log("connection successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
    await Listing.deleteMany({});
    //listing owner
    initData.data = initData.data.map((obj) => ({...obj , owner: "690307ca9efb31eb1e9b3972" }))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();