import esbuild from "esbuild";
import process from "process";

const banner =
`/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === 'production');

esbuild.build({
	banner: {
		js: banner,
	},
	entryPoints: ['./src/index.tsx'],
	bundle: true,
	minify: prod,
	format: 'cjs',
	platform: "node",
	target: 'node18',
	logLevel: "info",
	sourcemap: prod ? false : 'inline',
	//TODO replace with font extensions so that they will be built
	loader: {
		'.png': 'dataurl',
		'.css': 'dataurl'
	},
	external: ['canvas', "./xhr-sync-worker.js"],
	treeShaking: true,
	outfile: './out/index.js',
}).catch(() => process.exit(1));