const dbPool = require('./mysql2connection');


//SQL commands
const sql = {
    GET_PRODUCTS: 'SELECT id, product_name productName, price, image_url imageUrl, category FROM product',
    GET_PRODUCTS_CATEGORY: 'SELECT id, product_name productName, price, image_url imageUrl, category  FROM product WHERE category=?',
    INSERT_PRODUCTS: 'INSERT INTO product (product_name, price, image_url,category) VALUES (?,?,?,?)',
    GET_CATEGORIES: 'SELECT category_name, category_description, COUNT(category) items_in_category FROM product_category LEFT JOIN product ON product_category.category_name = product.category GROUP BY category_name ORDER BY COUNT(category)',
    INSERT_CATEGORIES: 'INSERT INTO product_category VALUES (?,?)',
    GET_PRODUCT_BY_ID: 'SELECT id, product_name productName, price, image_url imageUrl, category  FROM product WHERE id = ?',
    UPDATE_PRODUCT_PRICE: 'UPDATE product SET price = ? WHERE id = ?',
    GET_PRODUCT_BY_NAME: 'SELECT id, product_name productName, price, image_url imageUrl, category  FROM product WHERE product_name = ?',
    DELETE_PRODUCTS: 'DELETE FROM product WHERE id = ?',
}
/***
 * Middleware to find product by ID or name, returns an error if not found
 */
const productFinder = async (req, res, next) => {
    /// Check if given param is number or name and use appropriate SQL code
    const product = !isNaN(req.params.param) ? 
    await dbPool.execute(sql.GET_PRODUCT_BY_ID, [req.params.param]) : 
    await dbPool.execute(sql.GET_PRODUCT_BY_NAME, [req.params.param])
    if (product[0].length === 0) {
        return res.status(404).json({error: 'Product was not found by ID or name...'})
    }
    req.product = product[0][0]
    next()
}

/***
 * Delete a product or multiple at the same time
 */
async function deleteProducts(products) {
    const connection = await dbPool.getConnection();
    try {
        await connection.beginTransaction();
        for (const p of products) {
            await connection.execute(sql.DELETE_PRODUCTS, [p]);
        }
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    }
}

/***
 * Update product price by ID
 */
async function updatePrice(product, newPrice) {
    try {
        if (isNaN(newPrice)) {
            throw new Error('New price must be a number')
        }
        await dbPool.execute(sql.UPDATE_PRODUCT_PRICE, [newPrice, product.id])
    } catch (error) {
        throw error
    }
}
/**
 * Gets all the products
 */
async function getProducts(category){
    let result;
    if(category){
        result = await dbPool.execute(sql.GET_PRODUCTS_CATEGORY, [category]);
    }else{
        result = await dbPool.execute(sql.GET_PRODUCTS);
    }
    
    return result[0];
}

/**
 * Gets all the products by category
 */
async function getCategoryProducts(category){
    const [rows] = await dbPool.execute(sql.GET_PRODUCTS_CATEGORY, [category]);
    return rows;
}

/**
 * Adds new products by using transaction
 */
async function addProducts(products){
    //let connection;
    const connection = await dbPool.getConnection();
    try{
        await connection.beginTransaction();
        for (const p of products) {
            console.log(p);
            await connection.execute(sql.INSERT_PRODUCTS, [p.productName, p.price, p.imageUrl, p.category]);
        }

        await connection.commit();

    }catch(error){
        await connection.rollback();
        throw error;
    }
}

/**
 * Gets all the categories
 */
async function getCategories(){
    const [row] = await dbPool.execute(sql.GET_CATEGORIES);
    return row;
}

/**
 * Adds new categories
 */
async function addCategories(categories){
    let connection;
    try{
        const connection = await dbPool.getConnection();
        await connection.beginTransaction();

        for (const c of categories) {
            await connection.execute(sql.INSERT_CATEGORIES, [c.categoryName, c.description]);
        }

        await connection.commit();

    }catch(error){
        await connection.rollback();
        throw error;
    }
}

/**
 * Get a product by name
 */
async function getByID(id) {
    const result = await dbPool.execute(sql.GET_PRODUCT_BY_ID, [id])
    return result[0]
}
module.exports = { deleteProducts, productFinder, updatePrice, getByID, getProducts, getCategoryProducts, addProducts, getCategories, addCategories};