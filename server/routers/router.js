const Auth = require('../controllers/auth')
const Shop = require('../controllers/shops')
const Order = require('../controllers/orders')
const User = require('../controllers/users')
const FileUpload = require('../controllers/fileUpload')
const express = require('express')

const router = express.Router()

router.post('/signup',Auth.signup)
router.post('/login',Auth.login)

// 微信登录
router.post('/signin',Auth.signin)

// users
router.get('/user', Auth.isAuth, User.getUser)
router.patch('/userfield', Auth.isAuth, User.changeUserField)
router.patch('/password', Auth.isAuth, User.changePassword)    

// shopcate
router.post('/shopcate', Auth.isAuth, Shop.addShopcate )
router.delete('/shopcate/:id', Auth.isAuth, Shop.removeShopcate )
router.get('/shopcates', Shop.getShopcates )
router.put('/shopcate', Auth.isAuth, Shop.updateShopcate )

// shop
router.post('/shop', Auth.isAuth, Shop.addShop )
router.delete('/shop/:id', Auth.isAuth, Shop.removeShop )
router.get('/shops', Auth.isAuth, Shop.getShops )
router.get('/shop/:id', Shop.getShop )
router.put('/shop', Auth.isAuth, Shop.updateShop )
router.patch('/shop',Auth.isAuth, Shop.updateShopStatus)

// wexin menu cate grouped shops
router.get('/shopGroup', Shop.getShopsByCateWithPage);
// weixin menu get shops
router.get('/menu', Shop.getShopsByCateNotPage)

// order
router.post('/order', Auth.isAuth, Order.addOrder)
router.patch('/order', Auth.isAuth, Order.updateOrderStatus)
router.delete('/order/:id', Auth.isAuth, Order.deleteOrder)
router.get('/orders', Auth.isAuth, Order.getOrders )
router.get('/order/:id', Auth.isAuth, Order.getOrder )

// file upload
router.post('/upload/image', Auth.isAuth,FileUpload.upload.single("file"), FileUpload.uploadFile)
router.post("/upload/photos",Auth.isAuth,FileUpload.upload.array("files", 9),FileUpload.uploadFiles);


router.get('/test', Shop.test)
module.exports = router
