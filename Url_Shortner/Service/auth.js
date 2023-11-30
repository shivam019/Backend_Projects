// const sessionIdToUserMap = new Map(); //stateful

const jwt = require("jsonwebtoken");
const secret = "Shivam!&^%$##@"
function setUser(user) {
    const payload = {
     user,
    }
    return jwt.sign(payload, secret);

}

function getUser(token) {
    return jwt.verify(token, secret);
}

module.exports = {
    setUser, getUser,
};