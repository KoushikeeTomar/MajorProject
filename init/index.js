const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../Models/listing.js");
const User = require("../Models/user.js"); 


const MONGO_URL='mongodb://127.0.0.1:27017/WanderLust';

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(res=>{
    console.log("Connected to DB");
})
.catch(err =>{
    console.log(err);
});

const initDB=async()=>{
    await Listing.deleteMany({});
    const ownerId = new mongoose.Types.ObjectId('6880ca94d5a11b7da3d4138d');
    const existingUser = await User.findOne({ username: "testuser" });

if (!existingUser) {
    console.error("❌ testuser not found in DB. Create it first.");
    return;
}

    const listings = initData.data.map(listing => ({
    ...listing,
    image: listing.image,
    owner:existingUser._id,
    // initData.data=initData.data.map((obj) => ({...obj,owner:"686d257b2671254f4f203712"}));
    // owner: listing.ObjectId('686d257b2671254f4f203712')
    }));
    await Listing.insertMany(listings);
    console.log("Data was initialized");
};

main()
    .then(initDB)
    .catch(err => {
        console.error("Error connecting to DB or initializing data:", err);
    });

    