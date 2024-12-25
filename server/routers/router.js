const Auth = require('../controllers/auth')
const Shop = require('../controllers/shops')
const express = require('express')

const router = express.Router()

router.post('/signup',Auth.signup)
router.post('/login',Auth.login)

router.post('/shopcate/add', Auth.isAuth, Shop.addShopcate )
router.post('/shopcate/remove', Auth.isAuth, Shop.removeShopcate )
router.get('/shopcates/get', Auth.isAuth, Shop.getShopcates )
router.patch('/shopcate/update', Auth.isAuth, Shop.updateShopcate )

module.exports = router
