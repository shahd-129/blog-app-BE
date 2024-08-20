export class AppError extends Error{
    constructor(message , statusCode){
        super(message)
        this.statusCode = statusCode
    }
}


export const catchAysncErrorr = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err)=> next(err) )
    };
  };


  /// Global Error Handling
  export const globalErrorHandling = (error, req, res, next) => {
  
    // if(req.file){
    //   deleteFile(req.file.path)
    // }
    return res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  };
  