const ProductModel = require('../Models/ProductModel');

const CreateProduct = async (req, res) => {
    try {
        const productData = { ...req.body };
        if (req.file) {
            productData.image = `http://localhost:8006/images/${req.file.filename}`;
        }
        if (productData.productprice) {
            productData.productprice = parseInt(productData.productprice, 10);
        }
        if (productData.productstock) {
            productData.productstock = parseInt(productData.productstock, 10);
        }
        const newProduct = await ProductModel.create(productData); 
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};
const GetAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

const GetAllProductsById = async (req, res) => {
    try {
        const product = await ProductModel.findByPk(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({message: error.message})
    } 
};

const UpdateProduct = async (req, res) => {
    try {
        const product = await ProductModel.findByPk(req.params.id);
        if(product){
            const productData = { ...req.body };
            if (req.file) {
                productData.image = `http://localhost:8006/images/${req.file.filename}`;
            }
            if (productData.productprice) {
                productData.productprice = parseInt(productData.productprice, 10);
            }
            if (productData.productstock) {
                productData.productstock = parseInt(productData.productstock, 10);
            }
            await product.update(productData);
            res.status(200).json(product);
        }
        else{
            res.status(404).json({message: 'Product not found'})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }

};
const DeleteProduct = async (req, res) => {
    try {
        const product = await ProductModel.findByPk(req.params.id);
        if(product){
            await product.destroy();
            res.status(200).json({message: 'Product deleted successfully'});
    }
    else{
        res.status(404).json({message: 'Product not found'})
    }
} catch (error) {
    res.status(500).json({message: error.message})
}

};

module.exports = {CreateProduct, GetAllProducts, UpdateProduct,GetAllProductsById,DeleteProduct}   