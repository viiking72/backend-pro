
















































// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/user.controller')
// const {requireAdmin} = require('../middlewares/role.middleware')

// router.post("/",userController.createUser);

// router.get("/",requireAdmin,userController.getAllUsers);
// router.get("/me",userController.getProfile);
// router.delete("/",userController.deleteUser);

// module.exports = router;























// const express = require('express');
// const router = express.Router();

// const userRoutes = require('../routes/user.routes');
// const authRoutes = require('../routes/auth.routes')
// router.use('/user', userRoutes);

// router.use('/auth', authRoutes);

// module.exports = router;






// require('dotenv').config();
// const express = require('express');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const cors = require('cors');

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(helmet());
// if(process.env.NODE_ENV ==="development"){
//     app.use(morgan("dev"));
// }

// const routes = require('../routes');
// const connectDB = require('../config/db');
// app.use('/api',routes);

// app.use((req, res)=>{
//     res.status(404).json({
//         success: false,
//         message: "Route not found",
//         path: req.originalUrl
//     });
// });
// const PORT = process.env.PORT || 4000;
// const startServer = async()=>{
//     await connectDB();
//     app.listen(PORT, ()=>{
//         console.log(`Server running on port ${PORT}`);
//     });

// }
// startServer();

































// server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const errorHandler = require('../middlewares/error.middleware');
// const connectDB = require('../config/db');
// const {globalLimiter} = require('../middlewares/rateLimiter');
// const routes = require('../routes')

// const app = express();
// app.use(express.json());
// app.use(cors());
// app.use(helmet());
// if(process.env.NODE_ENV==="development"){
//     app.use(morgan("dev"));
// }

// app.use(globalLimiter);
// app.use('/api',routes);

// app.use((req,res)=>{
//     res.status(404).json({
//         success : false,
//         message : "Route not found",
//         path : req.originalUrl
//     });
// });

// app.use(errorHandler);
// const PORT = process.env.PORT || 4000;


// const startServer = async()=>{
//     await connectDB();
//     app.listen(PORT, ()=>{
//         console.log(`Server Running on port ${PORT}`);
//     });
// };
// startServer();