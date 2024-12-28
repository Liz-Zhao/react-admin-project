const Auth = require('../controllers/auth')
const Shop = require('../controllers/shops')
const Order = require('../controllers/orders')
const express = require('express')

const router = express.Router()

router.post('/signup',Auth.signup)
router.post('/login',Auth.login)

// shopcate
router.post('/shopcate', Auth.isAuth, Shop.addShopcate )
router.delete('/shopcate/:id', Auth.isAuth, Shop.removeShopcate )
router.get('/shopcates', Auth.isAuth, Shop.getShopcates )
router.put('/shopcate', Auth.isAuth, Shop.updateShopcate )

// shop
router.post('/shop', Auth.isAuth, Shop.addShop )
router.delete('/shop/:id', Auth.isAuth, Shop.removeShop )
router.get('/shops', Auth.isAuth, Shop.getShops )
router.get('/shop/:id', Auth.isAuth, Shop.getShop )
router.put('/shop', Auth.isAuth, Shop.updateShop )
router.patch('/shop',Auth.isAuth, Shop.updateShopStatus)

// order
router.post('/order', Auth.isAuth, Order.addOrder)
router.patch('/order', Auth.isAuth, Order.cancelOrder)
router.delete('/order/:id', Auth.isAuth, Order.deleteOrder)
router.get('/orders', Auth.isAuth, Order.getOrders )
router.get('/order/:id', Auth.isAuth, Order.getOrder )

module.exports = router
