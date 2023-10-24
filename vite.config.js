import { defineConfig } from "vite";
import path from "path";

module.exports = defineConfig({
	server: {
		host: "localhost",
		port: 3000,
	},

	base: "/",
	build: {
		outDir: "dist",
		rollupOptions: {},
	},
});
