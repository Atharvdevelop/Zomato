const db = require('../Config/db');
const { DataTypes } = require('sequelize');

const Order = db.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    restaurantName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    items: {
        type: DataTypes.TEXT, // Store JSON string of items array
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deliveryFee: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    platformFee: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gst: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tip: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    grandTotal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Order Placed' // States: 'Order Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'
    }
}, { timestamps: true, tableName: 'Orders' });

module.exports = Order;
