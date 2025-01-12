const routesConfig = [
    {
        path:'/dashboard',
        element: 'Dashboard',
        name:'图表',
        icon:'',
    },
    {
        path:'/shopcate',
        element: 'ShopCategory',
        name:'商品类型',
        icon: 'ShopTwoIcon',
    },
    {
        path:'/shop',
        element: 'Shop',
        name:'商品',
        icon:'LocalMallIcon',
    },
    {
        path:'/shop/:id',
        element: 'AddShop',
        name:'商品详情',
        icon:'',
    },
    {
        path:'/shop_add',
        element: 'AddShop',
        name:'商品zeng',
        icon:''
    },
    {
        path:'/order',
        element: 'Order',
        name:'订单管理',
        icon:'GavelIcon',
    },
    {
        path:'/order/:id',
        element: 'OrderDetial',
        name:'订单详情',
        icon:'',
    },
    {
        path:'/user',
        element: 'UserInfo',
        name:'个人信息',
        icon: 'AccessibilityIcon',
    }


]

export default routesConfig;