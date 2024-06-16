// logic to do not upload credentials
if (process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");
const User = require("./models/user.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cron = require('node-cron');
const Auction = require('./models/auction.js');
const Bid = require('./models/bid.js');
const Notify = require("./models/notification.js");

const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);

const listingRouter = require("./routes/listing.js");
const auctionRouter = require("./routes/auction.js");
const userRouter = require("./routes/user.js");
const adminRouter = require("./routes/admin.js");
const { fetchUserNotifications, isLoggedIn } = require('./middleware.js');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// set session on cookie
const sessionOption = {
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

const MONGO_URL = "mongodb://127.0.0.1:27017/CarAuction";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console, log(err);
    })



// using session middleware
app.use(session(sessionOption));
app.use(flash());

// using passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// using for user information added in the session and also for removing from the session 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// access session data in res.local variable
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//use notification middleware globally
app.use(fetchUserNotifications);

// // Use the middleware to fetch user notifications
// app.use(fetchUserNotifications);

// // Schedule auction start
// cron.schedule('* * * * *', async () => {
//     const now = new Date();
//     const auctionsToStart = await Auction.find({ startDate: { $lte: now }, status: 'pending' });
//     auctionsToStart.forEach(async (auction) => {
//         auction.status = 'ongoing';
//         await auction.save();
//         console.log(`Auction ${auction._id} started`);
//     });
// });


// // Schedule auction end
// cron.schedule('* * * * *', async () => {
//     const now = new Date();
//     const auctionsToEnd = await Auction.find({ endDate: { $lte: now }, status: 'ongoing' });
//     auctionsToEnd.forEach(async (auction) => {
//         auction.status = 'finished';
//         for (let list_id of auction.auctionList) {
//             await Listing.findByIdAndUpdate(list_id, { status: 'finished' }, { runValidators: true, new: true });
//         }
//         await auction.save();
//         console.log(`Auction ${auction._id} ended`);
//     });
// });

const notifyUsers = async (message, link) => {
    const users = await User.find();
    const notifications = [];
    for (const user of users) {
        notifications.push({
            user: user._id,
            message: message,
            link: link
        });
    }
    await Notify.insertMany(notifications);
};

// Schedule auction start
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const auctionsToStart = await Auction.find({ startDate: { $lte: now }, status: 'pending' });

    for (const auction of auctionsToStart) {
        auction.status = 'ongoing';
        await auction.save();
        console.log(`Auction ${auction._id} started`);

        // Notify all users
        await notifyUsers(`Auction ${auction.name} has started.`, `/auctions`);
        console.log(`Notifications sent for auction ${auction._id}`);
    }
});

// Schedule auction end
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const auctionsToEnd = await Auction.find({ endDate: { $lte: now }, status: 'ongoing' });

    for (const auction of auctionsToEnd) {
        auction.status = 'finished';
        for (let list_id of auction.auctionList) {
            await Listing.findByIdAndUpdate(list_id, { status: 'finished' }, { runValidators: true, new: true });
        }
        await auction.save();
        console.log(`Auction ${auction._id} ended`);

        // Notify all users
        await notifyUsers(`Auction ${auction.name} has ended.`, `/auctions/bids/result`);
        console.log(`Notifications sent for auction ${auction._id}`);
    }
});


// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "abc@gmail.com",
//         username: "abcw",
//         phoneNumber: "03267327",
//         location: "hgasdja",

//     });
//     password = "1234";
// console.log(password);
//     let registerUser = await User.register(fakeUser, password);

//     res.send(registerUser);
// });

//Homepage
app.get("/homepage", (req, res) => {
    res.render("homepage.ejs");
});

// Admin Router
app.use("/admin", adminRouter);

// Listing Router
app.use("/listings", listingRouter);

// Auction Router
app.use("/auctions", auctionRouter);

// User Router
app.use("/", userRouter);

// Route to mark notification as read
app.post('/notifications/:id/read', isLoggedIn, wrapAsync(async (req, res) => {
    try {
        const notification = await Notify.findById(req.params.id);
        if (!notification) {
            return res.status(404).send('Notification not found');
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).send('Notification marked as read');
    } catch (err) {
        res.status(500).send(err);
    }
}));  


// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Handle bid placement
    socket.on('placeBid', async ({ listingId, bidAmount, userId }) => {
        try {
            const listing = await Listing.findById(listingId);

            // Check if the auction is ongoing
            const auction = await Auction.findOne({ auctionList: listingId, status: 'ongoing' });
            if (!auction) {
                // Auction has ended, notify the user and return
                socket.emit('auctionEnded', { listingId });
                return;
            }

            const allBids = await Bid.find({ listing: listingId });
            let basePrice = parseFloat(listing.basePrice);
            basePrice += parseFloat(bidAmount);

            let bidExist = false;
            for (let bid of allBids) {
                if (bid.user == userId) {
                    bidExist = true;
                    await Bid.findByIdAndUpdate(bid._id, { amount: basePrice }, { runValidators: true, new: true });
                    break;
                }
            }

            if (!bidExist) {
                let newBid = new Bid({
                    user: userId,
                    amount: basePrice,
                    listing: listing._id,
                });
                await newBid.save();
            }

            await Listing.findByIdAndUpdate(listingId, { basePrice: basePrice }, { runValidators: true, new: true });

            // Fetch all previous bidders except the current user
            const previousBidders = allBids.map(bid => bid.user.toString()).filter(user => user !== userId);

            // Remove duplicates
            const uniquePreviousBidders = [...new Set(previousBidders)];

            // Create and send notifications to all previous bidders
            for (let bidder of uniquePreviousBidders) {
                const notification = new Notify({
                    user: bidder,
                    message: `A new bid has been placed on listing ${listing.title}`,
                    link: `/auctions/listings/${listing._id}`
                });
                await notification.save();

                // Emit the notification to the specific user if they are connected
                const sockets = io.sockets.sockets;
                sockets.forEach((s) => {
                    if (s.userId === bidder) {
                        s.emit('newNotification', notification);
                    }
                });
            }

            io.emit('bidUpdate', { listingId, basePrice });

            // Notify the client of the successful bid placement
            socket.emit('bidPlaced', { success: true, message: 'New bid added', listingId, basePrice });
        } catch (error) {
            console.error('Error placing bid: ', error);

            // Notify the client of the error
            socket.emit('bidPlaced', { success: false, message: 'Error placing bid' });
        }
    });
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         condition: "used",
//         carType: "petrol",
//         registrationType: "private",
//         registrationDate: "12-6-2013",
//         brandModel: "BMW M3",
//         mileage: 12000,
//         year: 2013,
//         seat: 4,
//         color: "Black",
//         title: "BMW",
//         description: "used car",
//         price: 30000,
//         location: "Cyberjaya, Selangor",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

// Unknown Page Error
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error handeling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err });
});

server.listen(8080, () => {
    console.log("Server is listening to port 8080");
}); 