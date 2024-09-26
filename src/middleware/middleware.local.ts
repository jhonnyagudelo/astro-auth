import { ProtectedRoutes } from "@/helper/routes";
import type { MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

// `context` y `next` son automáticamente tipados

// const privateRoutes = [`/${ProtectedRoutes}`];
const privateRoutes = ["/protected"];

export const onRequest = defineMiddleware(async ({ url, request }, next) => {
	const authHeaders = request.headers.get("authorization") ?? "";
	if (privateRoutes?.includes(url.pathname)) {
		return checkLocalAuth(authHeaders, next);
	}
	return next();
});

const checkLocalAuth = (authHeaders: string, next: MiddlewareNext) => {
	if (authHeaders) {
		const authValue = authHeaders.split(" ").at(-1) ?? "user:pass";
		const decodedValue = atob(authValue).split(":");
		const [user, password] = decodedValue;
		if (user === "admin" && password === "admin") {
			return next();
		}
	}
	return new Response("Acceso no autorizado", {
		status: 401,
		headers: {
			"WWW-Authenticate": 'Basic realm="Área Restringida"',
		},
	});
};
