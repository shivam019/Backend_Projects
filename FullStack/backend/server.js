import {express} from 'express';
const app = express();

const PORT = 3000;

//localhost

const corsOptions = {
    origin: 'http://example.com', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable cookies or other credentials
    optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
    

app.use(cors(corsOptions));

app.get("/", (req,res)=> {
    res.send("server is ready");
})


app.get("/api/jokes", (req,res)=> {
    const jokes = [ 
        
    {
        id: 1,
        title: "roses are red"
    },

   {
    id: 2,
    title: "voilet are pink, this is very ugly joke"
   }]

   res.send(jokes);
})

app.listen(PORT, ()=> {console.log("connected to the server")})