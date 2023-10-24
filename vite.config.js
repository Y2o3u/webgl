import { defineConfig } from "vite";

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
