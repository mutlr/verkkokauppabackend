const router = require('express').Router();

const {productFinder, updatePrice, getByID, getProducts, getCategoryProducts, addProducts, getCategories, addCategories} = require('../db_tools/product_db');


/**
 * Endpoint for getting the products. 
 * Optional category query parameter for filtering only products from that category
 */
router.get('/products', async (req, res) => {
    const category = req.query.category;
    console.log('Kategoria: ', category)
    try {
       res.status(200).json(await getProducts(category));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Endpoint for getting a product by ID or name
 */
router.get('/products/:param', productFinder, async (req, res) => {
    try {
        const product = req.product
        res.status(200).json({product})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})
/**
 * Endpoint for changing the product price
 */
router.post('/products/:id', async (req, res) => {
    const price = req.body.price
    const id = req.params.id
    try {
            await updatePrice(id, price)
            const product = await getByID(id)
            res.status(200).json({updated: product})
    } catch (error) {
        res.json({error: error.message})
    }
})

/**
 * Endpoint for adding new products 
 */
router.post('/products', async (req, res) => {
    try {
        const { products } = req.body;
        await addProducts(products);
        res.status(200).send("Products added!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Endpoint for getting all the categories
 */
router.get('/categories', async (req, res) => {
    try {
        res.json(await getCategories());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Endpoint for adding new product categories
 */
router.post('/categories', async (req, res) => {
    try {
        const {categories} = req.body;
        await addCategories(categories);
        res.status(200).send("Categories added!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;