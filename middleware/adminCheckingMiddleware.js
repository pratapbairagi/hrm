

module.exports =  (role) => {
    return (req, res, next) => {
        if (req.user.role !== role ) {
            return res.status(400).json({
                success : false,
                message : "You are not authorized to do this task !"
            })
        }
        else{
            return next()
        }
    }
}