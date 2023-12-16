
import {createRouter, createWebHistory} from 'vue-router'
import store from '@/store/index.js'
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
import AdminBrands from "@/views/admin/brand/AdminBrands.vue";
import ListOrder from "@/views/admin/order/ListOrder.vue";
import EditOrder from "@/views/admin/order/EditOrder.vue";
import ProductDetails from "@/views/client/ProductDetails.vue";
import CartView from "@/views/client/product/CartView.vue";
import ListProduct from "@/views/client/product/ListProduct.vue";
import SearchProducts from "@/views/client/product/SearchProducts.vue";
import ForgotPassword from "@/views/client/user/ForgotPassword.vue";
import OrdersList from "@/views/client/order/OrdersList.vue";
import OrderDetails from "@/views/client/order/OrderDetails.vue";
import AccountView from "@/views/client/user/AccountView.vue";
import CheckoutOrder from "@/views/client/checkout/CheckoutOrder.vue";
import SuccessPay from "@/views/client/checkout/SuccessPay.vue";
import AdminUsers from "@/views/admin/Users/AdminUsers.vue";
import AddPost from "@/views/admin/post/AddPost.vue";
import AdminPosts from "@/views/admin/post/AdminPosts.vue";
import EditPost from "@/views/admin/post/EditPost.vue";
import NotFound from "@/views/client/exception/NotFound.vue";
import testAuth from "@/views/testAuth.vue";
import Wishlist from "@/views/client/wishlist/Wishlist.vue";

import NewsPage from "@/views/client/NewsPage.vue";
import NewsDetails from "@/views/client/NewsDetails.vue";





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

        meta: {title: 'Đăng nhập', requiresAuth: false}
    },
    {
        path: '/signup',
        name: 'SignupView',
        component: SignupView,

        meta: {title: 'Đăng ký', requiresAuth: false}

    },
    {
        path: '/admin/products',
        name: 'AdminProducts',
        component: AdminProducts,
        meta: {title: 'Admin - Trang danh sách sản phẩm', requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/admin',
        name: 'DashboardView',
        component: DashboardView,

        meta: {title: 'Admin - Dashboard', requiresAuth: true, requiresAdmin: true}

    },
    {
        path: '/admin/products/create',
        name: 'AddProduct',
        component: AddProduct,

        meta: {title: 'Admin - Thêm sản phẩm', requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/admin/products/update/:id',
        name: 'EditProduct',
        component: EditProduct,

        meta: {title: 'Admin - Sửa thông tin sản phẩm', requiresAuth: true, requiresAdmin: true}

    },
    {
        path: '/admin/categories',
        name: 'ListCategory',
        component: ListCategory,

        meta: {title: 'Admin - Trang danh sách danh mục', requiresAuth: true, requiresAdmin: true}

    },
    {
        path: '/admin/promotions',
        name: 'ListPromotion',
        component: ListPromotion,

        meta: {title: 'Admin - Trang danh sách khuyến mãi', requiresAuth: true, requiresAdmin: true}

    },
    {
        path: '/admin/promotions/create',
        name: 'AddPromotion',
        component: AddPromotion,

        meta: {title: 'Admin - Thêm khuyến mãi', requiresAuth: true, requiresAdmin: true}

    },
    {
        path: '/admin/promotions/update/:id',
        name: 'EditPromotion',
        component: EditPromotion,

        meta: {title: 'Admin - Sửa thông tin khuyến mãi', requiresAuth: true, requiresAdmin: true}

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
        meta: {title: 'Admin - Trang danh sách thương hiệu', requiresAuth: true, requiresAdmin: true}

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

        meta: {title: 'Đơn hàng', requiresAuth: true}

    },
    {
        path: '/orders-list/:id',
        name: 'OrderDetails',
        component: OrderDetails,

        meta: {title: 'Chi tiết đơn hàng', requiresAuth: true}

    },
    {
        path: '/admin/orders-list',
        name: 'ListOrder',
        component: ListOrder,

        meta: {title: 'Admin - Trang danh sách đơn hàng', requiresAuth: true, requiresAdmin: true}

    },
    {
        path: '/admin/orders-list/:id',
        name: 'EditOrder',
        component: EditOrder,
        meta: {title: 'Admin - Thông tin đơn hàng', requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/account',
        name: 'AccountView',
        component: AccountView,

        meta: {title: 'Tài khoản', requiresAuth: true}
    },
    {

        path: '/not-found',
        name: 'NotFound',
        component: NotFound,
        meta: {title: 'Không tìm thấy'}
    },
    {
        path: '/test',
        name: 'TestAuth',
        component: testAuth,
    },
    {path: '/:pathMatch(.*)*', component: NotFound, meta: {title: 'Không tìm thấy'}},

        {
        path: '/checkout',
        name: 'Checkout',
        component: CheckoutOrder,
        meta: {title: 'Thanh toán', requiresAuth: true}
    },

    {
        path: '/success',
        name: 'SuccessTransaction',
        component: SuccessPay,
        meta: {title: 'Thanh toán thành công', requiresAuth: true}
    },
    // thêm
    {
        path: '/admin/users',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: {title: 'Trang danh sách người dùng', requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/admin/news',
        name: 'AdminPosts',
        component: AdminPosts,
        meta: {title: 'Trang danh sách tin tức', requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/admin/posts/create',
        name: 'AddPost',
        component: AddPost,
        meta: {title: 'Trang thêm tin tức', requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/admin/posts/update/:id',
        name: 'EditPost',
        component: EditPost,
        meta: {title: 'Trang sửa tin tức', requiresAuth: true, requiresAdmin: true}
    },
    {
        path: '/wishlist',
        name: 'Wishlist',
        component: Wishlist,
        meta: {title: 'Sản phẩm yêu thích'}
    },
    {
        path: '/news',
        name: 'NewsPage',
        component: NewsPage,
        meta: {title: 'Tin Tức'}
    },

    {
        path: '/news/:slug/:id',
        name: 'NewsDetails',
        component: NewsDetails,
        meta: {title: 'Chi tiết tin tức'}
    },
]


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.afterEach((to) => {

    document.title = to.meta.title || 'Không có tiêu đề'; // Set the document title based on the route's meta title
});
router.beforeEach((to, from, next) => {

    const isAuthenticated = store.state.isAuthenticated;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

    if (requiresAuth && !isAuthenticated) {
        // Nếu trang yêu cầu xác thực và người dùng chưa đăng nhập, chuyển hướng đến trang đăng nhập
        next('/signin');
    } else if (requiresAdmin && store.state.user.role !== 'ADMIN') {
        // Nếu trang yêu cầu quyền Admin và người dùng không có quyền, chuyển hướng đến trang khác
        next({path: '/not-found'}); // hoặc next('/unauthorized') tùy thuộc vào cấu hình của bạn
    } else if (isAuthenticated && (to.path == '/signin' || to.path == '/signup' || to.path == '/forgot-password')) {
        next('/');
    } else {
        // Nếu route không yêu cầu xác thực, cho phép truy cập
        next();
    }
});

export default router
