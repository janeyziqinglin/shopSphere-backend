//errorHandler take in 4 parameters
//first check if the response object already has a status code set e.g. if no email is given, userController will set status to 400 
//400 error indicates a problem with the client's request, 
//500 error indicates a problem with the server processing the request.
const errorHandler = (err, req, res, next) => {
    //if statusCode exists, statusCode=statusCode, else statusCode=500
    const statusCode = res.statusCode ? res.statusCode : 500;
  
    res.status(statusCode);

    //give error message and location of error
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
  };
  
  module.exports = errorHandler;
