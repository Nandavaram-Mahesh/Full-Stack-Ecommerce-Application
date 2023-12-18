# createServer
  
  Creating an HTTP Server (httpServer):

  const httpServer = createServer(app);
  
  This line uses Node.js's built-in http module to create an HTTP server. The createServer function takes a callback function (or an instance of an object with the appropriate methods) to handle incoming HTTP requests.

  In this case, you are passing your Express application (app) as the callback function. This means that your Express application will handle all incoming HTTP requests processed by this server.
  
  The httpServer variable now represents a running HTTP server that will delegate incoming requests to your Express application for processing.


# Dotenv
  dotenv.config() Method:

  The dotenv.config() method is used to load the variables from the .env file into the application's environment.
  The path option specifies the path to the .env file.
  In this case, it's set to "./.env", indicating that the .env file is located in the root directory 
  of the project. 

# express.json()
  When a client sends a POST request with a JSON payload to your server, the express.json() middleware parses the JSON data and makes it available in the req.body object.

# express.urlencoded()
  When a client submits a form with the application/x-www-form-urlencoded content type to your server (common in HTML forms), the express.urlencoded() middleware parses the form data and makes it available in the req.body object.

# CORS
  ## Same-Origin Policy:
    Default Behavior: By default, web browsers enforce the same-origin policy, meaning that a web page served from one domain is not allowed to make requests to a different domain using JavaScript.
  ## Cross-Origin Requests:
    Definition: If a web page from domain1.com wants to make an HTTP request to domain2.com using JavaScript, this is considered a cross-origin request.

    Security Restriction: Browsers restrict such requests due to security concerns. Without restrictions, a malicious site could make unauthorized requests on behalf of a user.



# Higher Order FUnctions
  A Higher Order Function (HOF) is a concept in functional programming where functions can take other functions as arguments and/or return functions as results. 
  In other words, a Higher Order Function operates on other functions by either taking them as arguments or returning them.



# UTILS

  # APIERROR CLASS
  
    The ApiError class extends the built-in JavaScript Error class 


    Error.captureStackTrace:
        The captureStackTrace method is a static method of the Error class in Node.js. 
        It is used to capture the current call stack and attach it to the given error object. 
        The purpose is to exclude the constructor call (and potentially other irrelevant parts) from the stack trace,
        making the stack trace more relevant to where the error actually occurred in the application code.










# Connectiong to DB
 
 Db
 |
 |__ index.js  
 |
  ## connecting to the Db is an asynchronous operation 
    Here we are creating an instance of the Db by calling  Mongoose.connect(MongodbURI/DB_NAME)