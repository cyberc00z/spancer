import  jwt  from "jsonwebtoken"

/**
 * Generates a token for user
 * 
 * @param {object} user 
 * @param {string} secret 
 * @param {date} expriesIn  
 * 
 */
export const generateToken = (user, secret, expiresIn) => {
    const {id, username ,email } = user;
   
    return jwt.sign({id, username ,email}, secret, {expiresIn})
}
