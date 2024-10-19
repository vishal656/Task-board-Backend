const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
require("./Models/db");
const PORT=process.env.PORT || 8080;
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ProductRouter = require("./Routes/ProductRouter");


/* middlewares */
app.use(express.json());
app.use(cors());
app.use("/auth",AuthRouter);
app.use("/products",ProductRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})