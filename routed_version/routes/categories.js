const router = require('express').Router();

const {getCategories, addCategories} = require('../db_tools/product_db');

/**
 * Endpoint for getting all the categories
 */
router.get('/', async (req, res) => {
    try {
        res.json(await getCategories());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Endpoint for adding new product categories
 */
router.post('/', async (req, res) => {
    try {
        const { categories } = req.body;
        await addCategories(categories);
        res.status(200).send("Categories added!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router