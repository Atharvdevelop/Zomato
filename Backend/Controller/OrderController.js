const Order = require('../Models/OrderModel');

const CreateOrder = async (req, res) => {
    try {
        const {
            orderId,
            userId,
            restaurantName,
            items,
            totalPrice,
            deliveryFee,
            platformFee,
            gst,
            tip,
            grandTotal,
            address,
            paymentMethod
        } = req.body;

        const newOrder = await Order.create({
            orderId,
            userId,
            restaurantName,
            items: typeof items === 'string' ? items : JSON.stringify(items),
            totalPrice: parseInt(totalPrice, 10),
            deliveryFee: parseInt(deliveryFee, 10),
            platformFee: parseInt(platformFee, 10),
            gst: parseInt(gst, 10),
            tip: parseInt(tip, 10),
            grandTotal: parseInt(grandTotal, 10),
            address,
            paymentMethod,
            status: 'Order Placed'
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error("CreateOrder Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const GetAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error("GetAllOrders Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const GetOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { orderId: req.params.id }
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("GetOrderById Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const GetOrdersByUserId = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.params.userId },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error("GetOrdersByUserId Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const UpdateOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { orderId: req.params.id }
        });
        if (order) {
            const { status, grandTotal, userId, restaurantName } = req.body;
            await order.update({ status, grandTotal, userId, restaurantName });
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("UpdateOrder Error:", error);
        res.status(500).json({ message: error.message });
    }
};

const DeleteOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { orderId: req.params.id }
        });
        if (order) {
            await order.destroy();
            res.status(200).json({ message: 'Order deleted successfully' });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error("DeleteOrder Error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    CreateOrder,
    GetAllOrders,
    GetOrderById,
    GetOrdersByUserId,
    UpdateOrder,
    DeleteOrder
};
