import express from "express"
import { createProxyMiddleware } from "http-proxy-middleware"
import dotenv from "dotenv";

const app = express()

dotenv.config();
const routes = {
   	"/api/auth": "http://localhost:8081/auth",
   	"/api/users": "http://localhost:8081/users",
   	"/api/msgs": "http://localhost:8080/msgs"
}


for(const route in routes) {
   const target = routes[route];
   app.use(route, createProxyMiddleware({target, changeOrigin: true}));
}


const PORT = process.env.PORT;


app.listen(PORT, () => {
   console.log(`api gateway started listening on port : ${PORT}`)
})
