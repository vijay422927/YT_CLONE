import {createClient} from 'redis';
const redisClient= createClient({
    url:"redis://127.0.0.1:6379"
});

redisClient.on("connect",()=>
{
    console.log("redis connected succesfully");
    
});
redisClient.on("error",(err)=>
{
    console.log("redis not connected ",err);
    
});

await redisClient.connect();
export default redisClient;