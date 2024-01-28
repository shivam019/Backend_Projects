// Configuring CORS with specific options
 const corsOptions = {
    origin: 'http://example.com', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // enable cookies or other credentials
    optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
    

  module.exports = corsOptions;