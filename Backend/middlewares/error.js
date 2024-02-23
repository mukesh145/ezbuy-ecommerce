export default (err, req, res, next)=>{
    let error = {
        statusCode : err.statusCode || 500,
        message : err.message || "Internal Server Error"
    }
   
    res.status(err.statusCode).json({
        message: error.message,
    })
}