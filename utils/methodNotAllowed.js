const methodNotAllowed =(req,res)=>{
    res.status(400).json({
        message:`Method ${req.method} is not Allowed ${req.originalUrl}`
    })
}



module.exports=methodNotAllowed