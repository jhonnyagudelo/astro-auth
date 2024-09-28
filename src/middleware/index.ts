import { firebase } from "@/firebase/config";
import { ProtectedRoutes, PublicRoutes } from "@/helper/routes";
// import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

const privateRoutes = [
	`/${ProtectedRoutes?.PRIVATE}/${ProtectedRoutes?.PROTECTED}`,
];
const notAuthenticatedRoutes = [
	`/${PublicRoutes?.PUBLIC}/${PublicRoutes?.LOGIN}`,
	`/${PublicRoutes?.PUBLIC}/${PublicRoutes?.REGISTER}`,
];

export const onRequest = defineMiddleware(
	async ({ url, request, locals, redirect }, next) => {
		const isLoggedIn = !!firebase?.auth?.currentUser;
		const user = firebase?.auth?.currentUser;

		locals.isLoggedIn = isLoggedIn;
		if (user) {
			locals.user = {
				avatar: user?.photoURL ?? "",
				email: user?.email!,
				name: user?.displayName!,
				emailVerified: user?.emailVerified,
			};
		}

		if (!isLoggedIn && privateRoutes.includes(url.pathname)) {
			return redirect("/");
		}
		if (isLoggedIn && notAuthenticatedRoutes.includes(url.pathname)) {
			return redirect("/");
		}
		return next();
	},
);
