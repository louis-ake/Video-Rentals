module.exports = function (handler) {
    return async (req, res, next) => { // this structure is to make sure you're only passsing references, and therefore have access to these objects at runtime
        try {
            await handler(req, res);
        } catch (error) {
            next(error);
        }
    };
}