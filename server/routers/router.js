const Auth = require('../controllers/auth')
const Shop = require('../controllers/shops')
const Order = require('../controllers/orders')
const User = require('../controllers/users')
const {upload,uploadFile} = require('../controllers/fileUpload')
const express = require('express')

const router = express.Router()

router.post('/signup',Auth.signup)
router.post('/login',Auth.login)

// users
router.get('/user', Auth.isAuth, User.getUser)
router.patch('/userfield', Auth.isAuth, User.changeUserField)
router.patch('/password', Auth.isAuth, User.changePassword)    

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
router.patch('/order', Auth.isAuth, Order.updateOrderStatus)
router.delete('/order/:id', Auth.isAuth, Order.deleteOrder)
router.get('/orders', Auth.isAuth, Order.getOrders )
router.get('/order/:id', Auth.isAuth, Order.getOrder )

// file upload
router.post('/upload/image', Auth.isAuth ,upload.single("file"), uploadFile)
router.post("/upload/photos",Auth.isAuth ,upload.array("file", 9),uploadFile);

module.exports = router
