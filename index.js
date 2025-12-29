import {connectDb} from "./src/db/index.js";
import {app} from "./app.js";
import dotenv from 'dotenv';
dotenv.config();

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 3000,()=>
    {
        console.log(`server is running on ${process.env.PORT}`); 
    })
})
.catch(
  (err)=>
    {
        console.log(err);
    }
);