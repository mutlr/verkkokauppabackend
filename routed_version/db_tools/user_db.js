const dbPool = require('./mysql2connection');

//SQL commands
const sql = {
    REGISTER: 'INSERT INTO customer(first_name,last_name,username,pw) VALUES (?,?,?,?)',
    LOGIN: 'SELECT pw FROM customer WHERE username=?',
    GET_USER_DATA: 'SELECT first_name fname, last_name lname, username FROM customer WHERE username=?'
}

/**
 * Registers new user
 */
async function register(userData) {
   // Check username length
   if (userData[2].length < 4) {
      throw new Error('Username is too short')
   } else if (userData[3].length < 6) {
      throw new Error('Password is too short')
   }
    return await dbPool.execute(sql.REGISTER, userData);
}

/**
 * Gets database password hash by username
 */
async function getPw(username){
     const [rows] = await dbPool.execute(sql.LOGIN, [username]);
     if(rows.length>0){
        return rows[0].pw;
     }else{
        return null;
     }
}

/**
 * Gets user data by username
 */
async function getUserData(username){

    const [rows] = await dbPool.execute(sql.GET_USER_DATA, [username]);

    if(rows.length>0){
        return rows[0];
     }else{
        return null;
     }
}

module.exports = {register, getPw, getUserData};