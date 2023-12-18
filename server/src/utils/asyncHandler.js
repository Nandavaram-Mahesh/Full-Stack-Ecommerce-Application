/* 
Higher Order Function 

EXAMPLE

    function multiplier(factor) {
        return function (number) {
            return number * factor;
        };
    }

    const double = multiplier(2);
    console.log(double(5)); // Output: 10

*/


const asyncHandler = (requestHandler) =>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    } 
}


/*

function asyncHandler(requestHandler) {
    return function(req, res, next) {
        Promise.resolve(requestHandler(req, res, next)).catch(function(err) {
            next(err);
        });
    };
}

*/


export {asyncHandler}