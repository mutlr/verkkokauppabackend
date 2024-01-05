const router = require('express').Router();

const {deleteProducts, productFinder, updatePrice, getByID, getProducts, getCategoryProducts, addProducts} = require('../db_tools/product_db');


/**
 * Endpoint for getting the products. 
 * Optional category query parameter for filtering only products from that category
 */
router.get('/', async (req, res) => {
    const category = req.query.category;
    try {
       res.status(200).json(await getProducts(category));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Endpoint for getting a product by ID or name
 */
router.get('/:param', productFinder, async (req, res) => {
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
router.post('/:param', productFinder, async (req, res) => {
    const price = req.body.price
    try {
        const product = req.product
        await updatePrice(product, price)
        const updatedProduct = await getByID(product.id)
        res.status(200).json({updated: updatedProduct})
    } catch (error) {
        res.json({error: error.message})
    }
})

/**
 * Endpoint for adding new products 
 */
router.post('/', async (req, res) => {
    try {
        const { products } = req.body;
        await addProducts(products);
        res.status(200).send("Products added!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/***
 * Endpoint for deleting products
 */
router.delete('/', async (req, res) => {
    const { products } = req.body
    try {
        await deleteProducts(products)
        res.status(200).send(`Products ${products} deleted`)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
<<<<<<< HEAD
});

/**
 * Endpoint for adding new product categories
 */
router.post('/categories', async (req, res) => {
    try {
        const categories = req.body;
        await addCategories(categories);
        res.status(200).send("Categories added!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/product')
=======
})
>>>>>>> d9a4de4ef7d9124f32086b04a211bb4c1856b300

module.exports = router;