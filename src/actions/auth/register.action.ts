import { defineAction } from "astro:actions";
import { z } from "zod";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
} from "firebase/auth";
import { firebase } from "@/firebase/config";
import type { FirebaseError } from "firebase/app";

export const registerUser = defineAction({
	accept: "form",
	input: z.object({
		name: z.string().min(2),
		email: z.string().email(),
		password: z.string().min(6),
		remember_me: z.boolean().optional(),
	}),
	handler: async ({ name, password, email, remember_me }, { cookies }) => {
		//cookies
		if (remember_me) {
			cookies?.set("email", email, {
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), //1 año
				path: "/",
			});
		} else {
			cookies.delete("email", {
				path: "/",
			});
		}

		//creacion de usuario
		try {
			const user = await createUserWithEmailAndPassword(
				firebase.auth,
				email,
				password,
			);
			//Actualizar el nombre(displayName)
			updateProfile(firebase.auth.currentUser!, {
				displayName: name,
			});
			//verificar el correo
			await sendEmailVerification(firebase.auth.currentUser!, {
				url: "http://localhost:4321?/protected?emailVerified=true",
			});

			return {
				uid: user.user.uid,
				email: user.user.email,
			};
		} catch (error) {
			console.error(error);
			const firebaseError = error as FirebaseError;
			if (firebaseError.code === "auth/email-already-in-use") {
				throw new Error("El correo ya existe");
			}
			throw new Error("Auxilio algo salio mal");
		}

		return { ok: true, msg: "Usuario creado" };
	},
});
