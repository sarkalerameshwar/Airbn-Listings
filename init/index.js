const mongoose = require('mongoose');
const data = require("./data.js");
const Listing = require("../models/listing.model.js");

const URL = "mongodb+srv://sangitasarkale2007:yoE7NCEBa8jTsILs@cluster0.gpoqovu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose
  .connect(URL)
  .then((res) => {
    console.log("connection successfull!");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () =>{
//     await Listing.deleteMany({});

//     // Transform image field from object to string URL
    let transformedData = data.data.map(item => ({
        ...item,
        image: typeof item.image === 'object' && item.image !== null ? item.image.url : item.image
    }));
//     transformedData = transformedData.map((obj) =>({...obj, owner : "6837298d0d0aad7e486dffb7"}))

    await Listing.insertMany(transformedData);
    console.log("data is initialized");
}

initDB();
