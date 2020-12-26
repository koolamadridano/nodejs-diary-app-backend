const express = require('express')
const app = express();
const connectDb = require('./config/connection')

//Run connection
connectDb();

// @Init use of middleware
app.use(express.json({ 
    extended: false 
}))

// @Init use of routes
app.use('/api/users', require('./controllers/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})
