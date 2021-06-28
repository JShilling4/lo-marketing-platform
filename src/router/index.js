/* eslint-disable no-unused-vars */
import Router from "vue-router";

// public routes
import LoginPage from "@/views/LoginPage";
import CatalogLogin from "@/views/catalog/CatalogLogin";
// shared routes
import MobileHandoff from "@/views/MobileHandoff";

// ROUTER & ROUTE CONFIG
const router = new Router({
	mode: "history",
	routes: [
		/* ****** PUBLIC ROUTES ******** */

		// LOGIN
		{
			path: "/login",
			name: "login",
			meta: {
				requiresAuth: false,
			},
			component: LoginPage,
		},

		// MAGAZINE GIFT SELECTION
		{
			path: "/magazine-gift-selection",
			name: "magazineSelection",
			meta: {
				requiresAuth: false,
			},
			component: () =>
				import(
					/* webpackChunkName: "MagazineGiftClient" */ "@/views/MagazineGift-client"
				),
		},

		/* ****** STANDARD ROUTES ******** */

		// HOME
		{
			path: "/",
			name: "home",
			meta: {
				requiresAuth: true,
			},
			component: () =>
				import(/* webpackChunkName: "Home" */ "@/views/HomePage"),
		},

		// ALL ORDERS
		{
			path: "/orders",
			name: "orders",
			component: () =>
				import(/* webpackChunkName: "Orders" */ "@/views/OrdersPage"),
			meta: {
				requiresAuth: true,
			},
		},

		// ORDER DETAILS
		{
			path: "/orders/:orderNumber",
			name: "order", // this is used in the js on OrdersPage.vue
			props: true,
			meta: {
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "OrderDetail" */ "@/views/OrderDetail"
				),
		},

		// ORDER PROOF VIEWER (ALL PROOFS)
		{
			path: "/orders/:orderNumber/proofs",
			name: "orderProofs",
			meta: {
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "OrderProofs" */ "@/views/OrderProofs"
				),
		},

		// ORDER PROOF VIEWER (SINGLE PROOFS)
		{
			path: "/orders/:orderNumber/proofs/:proofId",
			name: "orderProof",
			meta: {
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "OrderProof" */ "@/views/OrderProofs"
				),
		},

		// LIBRARY
		{
			path: "/library",
			name: "library",
			meta: {
				title: "Marketing.Ruoff.com | Library",
				requiresAuth: true,
			},
			component: () =>
				import(/* webpackChunkName: "Library" */ "@/views/LibraryPage"),
		},

		// PRODUCT DETAILS
		{
			path: "/product/:productId",
			name: "ProductDetail",
			meta: {
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "ProductDetail" */ "@/views/ProductDetail"
				),
		},

		// PRODUCT REVIEWS
		{
			path: "/product/:productId/reviews",
			name: "ProductReviews",
			meta: {
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "ProductReviews" */ "@/views/ProductReviews"
				),
		},

		// PRODUCT REVIEW
		{
			path: "/product-review",
			name: "ProductReview",
			meta: {
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "ProductReview" */ "@/views/ProductReviews"
				),
		},

		// RESOURCES
		{
			path: "/resources",
			name: "resources",
			meta: {
				title: "Marketing.Ruoff.com | Resources",
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "Resources" */ "@/views/ResourcesPage"
				),
		},

		/* ****** PROFILE ROUTES ******** */

		// PROFILE PAGE
		{
			path: "/profile",
			name: "profile",
			meta: {
				title: "Marketing.Ruoff.com | Profile",
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "ProfilePage" */ "@/views/ProfilePage"
				),
		},

		// NOTIFICATION CENTER
		{
			path: "/notifications",
			name: "notifications",
			meta: {
				title: "Marketing.Ruoff.com | Notifications",
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "NotificationCenter" */ "@/views/NotificationCenter"
				),
		},

		// REFERRAL PARTNERS
		{
			path: "/referral-partners",
			name: "referralPartners",
			meta: {
				title: "Marketing.Ruoff.com | Referral Partners",
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "ReferralPartners" */ "@/views/ReferralPartners"
				),
		},

		// MAGAZINE GIFT (LO)
		{
			path: "/magazine-gift-program",
			name: "magazineGiftProgram",
			meta: {
				title: "Marketing.Ruoff.com | Magazine Gift Program",
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "MagazineGiftLO" */ "@/views/MagazineGift-lo"
				),
		},

		/* ****** ADMIN ROUTES ******** */

		// PRODUCT MANAGEMENT
		{
			path: "/admin/product-management",
			name: "productManagement",
			meta: {
				title: "Marketing.Ruoff.com | Product Management",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "ProductManagement" */ "@/views/admin/productManagement/ProductManagement"
				),
		},

		// ADD PRODUCT
		{
			path: "/admin/product-management/add-product",
			name: "productInterface",
			meta: {
				title: "Marketing.Ruoff.com | Add Product",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "AddProduct" */ "@/views/admin/productManagement/ProductInterface"
				),
		},

		// EDIT PRODUCT
		{
			path: "/admin/product-management/edit-product/:productId",
			name: "editProduct",
			meta: {
				title: "Marketing.Ruoff.com | Edit Product",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "EditProduct" */ "@/views/admin/productManagement/ProductInterface"
				),
		},

		// DUPLICATE PRODUCT
		{
			path: "/admin/product-management/duplicate-product/:productId",
			name: "duplicateProduct",
			meta: {
				title: "Marketing.Ruoff.com | Edit Product",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "DuplicateProduct" */ "@/views/admin/productManagement/ProductInterface"
				),
		},

		// CATEGORY MANAGEMENT
		{
			path: "/admin/categories-topics",
			name: "categoriesTopics",
			meta: {
				title: "Marketing.Ruoff.com | Categories & Topics",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "CategoryTopicManagement" */ "@/views/admin/CategoryTopicManagement"
				),
		},

		// USER MANAGEMENT
		{
			path: "/admin/user-management",
			name: "userManagement",
			meta: {
				title: "Marketing.Ruoff.com | User Management",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "UserManagement" */ "@/views/admin/userManagement/UserManagement"
				),
		},

		// EDIT USER
		{
			path: "/admin/user-management/edit-user/:userId",
			name: "editUser",
			meta: {
				title: "Marketing.Ruoff.com | User Management",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "EditUser" */ "@/views/admin/userManagement/EditUser"
				),
		},

		// TEAM MANAGEMENT
		{
			path: "/admin/team-management",
			name: "teamManagement",
			meta: {
				title: "Marketing.Ruoff.com | User Management",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "TeamManagement" */ "@/views/admin/TeamManagement"
				),
		},

		// REPORTS
		{
			path: "/admin/reports",
			name: "reports",
			meta: {
				title: "Marketing.Ruoff.com | Reports",
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "CategoryTopicManagement" */ "@/views/admin/Reports"
				),
		},

		// MAGAZINE PROGRAM
		{
			path: "/admin/magazine-program",
			name: "magazineProgram",
			meta: {
				title: "Marketing.Ruoff.com | Magazine Program",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "MagazineProgram" */ "@/views/admin/MagazineProgram"
				),
		},

		// REFERRAL PARTNERS
		{
			path: "/admin/referral-partners",
			name: "referralPartnerManagement",
			meta: {
				title: "Marketing.Ruoff.com | Referral Partners",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "ReferralPartnerManagement" */ "@/views/admin/ReferralPartnerManagement"
				),
		},

		// EMAIL MANAGEMENT
		{
			path: "/admin/email-management",
			name: "emailManagement",
			meta: {
				title: "Marketing.Ruoff.com | Email Management",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "EmailManagement" */ "@/views/admin/emailManagement/EmailManagement"
				),
		},

		{
			// ADD EMAIL
			path: "/admin/email-management/add-email",
			name: "addEmail",
			meta: {
				title: "Marketing.Ruoff.com | Add Email",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "addEmail" */ "@/views/admin/emailManagement/EmailInterface"
				),
		},
		{
			// EDIT EMAIL
			path: "/admin/email-management/edit-email/:emailId",
			name: "editEmail",
			meta: {
				title: "Marketing.Ruoff.com | Edit Email",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "editEmail" */ "@/views/admin/emailManagement/EmailInterface"
				),
		},
		{
			// VIEW EMAIL
			path: "/admin/email-management/view-email/:emailId",
			name: "viewEmail",
			meta: {
				title: "Marketing.Ruoff.com | View Email",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "viewEmail" */ "@/views/admin/emailManagement/EmailInterface"
				),
		},
		{
			// DUPLICATE EMAIL
			path: "/admin/email-management/duplicate-email/:emailId",
			name: "duplicateEmail",
			meta: {
				title: "Marketing.Ruoff.com | Duplicate Email",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "duplicateEmail" */ "@/views/admin/emailManagement/EmailInterface"
				),
		},

		// TEMPLATE MANAGEMENT
		{
			path: "/admin/email-management/template-management",
			name: "templateManagement",
			meta: {
				title: "Marketing.Ruoff.com | Template Management",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "EmailManagement" */ "@/views/admin/emailManagement/TemplateManagement"
				),
		},

		// COBRAND INVOICE
		{
			path: "/admin/cobrand-invoice",
			name: "cobrand",
			meta: {
				title: "Marketing.Ruoff.com | Co-brand Invoice",
				requiresAuth: true,
				requiresAdmin: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "CobrandInvoice" */ "@/views/admin/CobrandInvoice"
				),
		},

		// ---------- CATALOG ------------

		// CATALOG ENTRY POINT
		{
			path: "/catalog",
			name: "catalog",
			meta: {
				title: "Marketing.Ruoff.com | Catalog Login",
				requiresAuth: false,
			},
			redirect: "/catalog/library",
		},

		// MOBILE APP HANDOFF
		{
			path: "/mobile-handoff",
			name: "mobileHandoff",
			meta: {
				requiresAuth: false,
			},
			component: MobileHandoff,
		},

		// CATALOG LOGIN
		{
			path: "/catalog/login",
			name: "catalogLogin",
			meta: {
				title: "Marketing.Ruoff.com | Catalog Login",
				requiresAuth: false,
			},
			component: CatalogLogin,
		},

		// CATALOG LIBRARY
		{
			path: "/catalog/library",
			name: "catalogLibrary",
			meta: {
				title: "Marketing.Ruoff.com | Catalog",
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "CatalogLibrary" */ "@/views/catalog/CatalogLibrary"
				),
		},

		// CATALOG PRODUCT
		{
			path: "/catalog/product/:productId",
			name: "catalogProduct",
			meta: {
				title: "Marketing.Ruoff.com | Catalog",
				requiresAuth: true,
			},
			component: () =>
				import(
					/* webpackChunkName: "CatalogProductDetail" */ "@/views/catalog/CatalogProductDetail"
				),
		},

		// ---------- CLEANUP ------------

		// 404
		{
			path: "/404",
			meta: {
				title: "Marketing.Ruoff.com | 404 - Not Found",
				requiresAuth: false,
			},
			component: () =>
				import(
					/* webpackChunkName: "NotFoundPage" */ "@/views/NotFoundPage"
				),
		},

		// CATCH ALL
		{
			path: "*",
			meta: {
				title: "Marketing.Ruoff.com | 404 - Page Not Found",
				requiresAuth: false,
			},
			redirect: "/404",
		},
	],
});

router.afterEach((to, from) => {
	document.title = to.meta.title || "Marketing.Ruoff.com";
});

router.beforeEach(async (to, from, next) => {
	const user = JSON.parse(localStorage.getItem("mv3"));
	// console.log(store.state.users.activeUser);
	if (
		to.matched.some(
			(record) => record.meta.requiresAuth && !record.meta.requiresAdmin
		)
	) {
		if (user) {
			if (!to.name.includes("catalog")) {
				// they are going to a marketing route, make sure they are not a referral partner
				if (user.employeeNumber == 0) {
					next({ path: "/catalog/library" });
				} else {
					next();
				}
			} else {
				// headed to catalog and there is a token, you may pass
				next();
			}
		} else if (to.name.includes("catalog")) {
			// user object isnt there and they are headed to catalog so send them to catalog login
			next({ path: "/catalog/login" });
		} else {
			// user object isnt there and they are headed to marketing so send them to marketing login
			next({
				path: "/login",
				query: { ...to.query, returnUrl: to.path },
			});
		}
	} else {
		// no auth on this route, you may pass
		next();
	}

	if (to.matched.some((record) => record.meta.requiresAdmin)) {
		if (user && user.userRoles.includes("ROLE_MARKETING_EMPLOYEE")) {
			next();
		} else {
			next("/");
		}
	}
});

export default router;
