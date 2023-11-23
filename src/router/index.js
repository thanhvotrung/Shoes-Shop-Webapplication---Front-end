
import {createRouter, createWebHistory} from 'vue-router'

import SigninView from "@/views/client/SigninView.vue";
import SignupView from "@/views/client/SignupView.vue";
import HomePage from "@/views/client/HomePage.vue";
import AdminProducts from "@/views/admin/Product/AdminProducts.vue";
import DashboardView from "@/views/admin/DashboardView.vue";
import AddProduct from "@/views/admin/Product/AddProduct.vue";
import EditProduct from "@/views/admin/Product/EditProduct.vue";
import ListCategory from "@/views/admin/category/ListCategory.vue";
import ListPromotion from "@/views/admin/promotion/ListPromotion.vue";
import AddPromotion from "@/views/admin/promotion/AddPromotion.vue";
import EditPromotion from "@/views/admin/promotion/EditPromotion.vue";
import ProductDetails from "@/views/client/ProductDetails.vue";
import CartView from "@/views/client/product/CartView.vue";
import ListProduct from "@/views/client/product/ListProduct.vue";
import AdminBrands from "@/views/admin/brand/AdminBrands.vue";
import SearchProducts from "@/views/client/product/SearchProducts.vue";
import ForgotPassword from "@/views/client/user/ForgotPassword.vue";
import OrdersList from "@/views/client/order/OrdersList.vue";
import OrderDetails from "@/views/client/order/OrderDetails.vue";
import ListOrder from "@/views/admin/order/ListOrder.vue";
import AccountView from "@/views/client/user/AccountView.vue";


const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage,
        meta: {title: 'Trang chủ'},
    },
    {
        path: '/signin',
        name: 'SigninView',
        component: SigninView,
        meta: {title: 'Đăng nhập'}
    },
    {
        path: '/signup',
        name: 'SignupView',
        component: SignupView,
        meta: {title: 'Đăng ký'}
    },
    {
        path: '/admin/products',
        name: 'AdminProducts',
        component: AdminProducts,
        meta: {title: 'Admin - Trang danh sách sản phẩm'}
    },
    {
        path: '/admin',
        name: 'DashboardView',
        component: DashboardView,
        meta: {title: 'Admin - Dashboard'}
    },
    {
        path: '/admin/products/create',
        name: 'AddProduct',
        component: AddProduct,
        meta: {title: 'Admin - Thêm sản phẩm'}
    },
    {
        path: '/admin/products/update/:id',
        name: 'EditProduct',
        component: EditProduct,
        meta: {title: 'Admin - Sửa thông tin sản phẩm'}
    },
    {
        path: '/admin/categories',
        name: 'ListCategory',
        component: ListCategory,
        meta: {title: 'Admin - Trang danh sách danh mục'}
    },
    {
        path: '/admin/promotions',
        name: 'ListPromotion',
        component: ListPromotion,
        meta: {title: 'Admin - Trang danh sách khuyến mãi'}
    },
    {
        path: '/admin/promotions/create',
        name: 'AddPromotion',
        component: AddPromotion,
        meta: {title: 'Admin - Thêm khuyến mãi'}
    },
    {
        path: '/admin/promotions/update/:id',
        name: 'EditPromotion',
        component: EditPromotion,
        meta: {title: 'Admin - Sửa thông tin khuyến mãi'}
    },
    {
        path: '/:slug/:id',
        name: 'ProductDetails',
        component: ProductDetails,
        meta: {title: 'Chi tiết sản phẩm'}
    },
    {
        path: '/cart',
        name: 'CartView',
        component: CartView,
        meta: {title: 'Giỏ hàng'}
    },
    {
        path: '/products',
        name: 'ListProduct',
        component: ListProduct,
        meta: {title: 'Trang sản phẩm'}
    },
    {
        path: '/products/search',
        name: 'SearchProducts',
        component: SearchProducts,
        meta: {title: 'Tìm kiếm'}
    },
    {
        path: '/admin/brands',
        name: 'AdminBrands',
        component: AdminBrands,
        meta: {title: 'Admin - Trang danh sách thương hiệu'}
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: ForgotPassword,
        meta: {title: 'Quên mật khẩu'}
    },
    {
        path: '/orders-list',
        name: 'OrdersList',
        component: OrdersList,
        meta: {title: 'Đơn hàng'}
    },
    {
        path: '/orders-list/:id',
        name: 'OrderDetails',
        component: OrderDetails,
        meta: {title: 'Chi tiết đơn hàng'}
    },
    {
        path: '/admin/orders-list',
        name: 'ListOrder',
        component: ListOrder,
        meta: {title: 'Admin - Trang danh sách đơn hàng'}
    },
    {
        path: '/account',
        name: 'AccountView',
        component: AccountView,
        meta: {title: 'Tài khoản'}
    }
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.afterEach((to) => {
    document.title = to.meta.title || 'Your Default Title'; // Set the document title based on the route's meta title
});



export default router
