exports.handler = function(event, context, callback) {
    
    console.log("Added from the Sigma IDE and committed with message: commit #01");
    callback(null, {"message": "Successfully executed"});
}