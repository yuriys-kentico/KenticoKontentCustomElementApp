import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import url from "@rollup/plugin-url";
import svelte from "rollup-plugin-svelte";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import config from "sapper/config/rollup.js";
import pkg from "./package.json";
import json from "@rollup/plugin-json";

const mode = process.env.NODE_ENV;
const dev = mode === "development";
const legacy = !!process.env.SAPPER_LEGACY_BUILD;

const onwarn = (warning, onwarn) =>
  (warning.code === "MISSING_EXPORT" && /'preload'/.test(warning.message)) ||
  (warning.code === "CIRCULAR_DEPENDENCY" &&
    /[/\\]@sapper[/\\]/.test(warning.message)) ||
  warning.code === "THIS_IS_UNDEFINED" ||
  onwarn(warning);

const ignoreMarkdown = {
  load: (id) => {
    if (id.endsWith(".md")) return "";
  },
};

export default {
  client: {
    input: config.client.input().replace(/\.js$/, ".ts"),
    output: config.client.output(),
    plugins: [
      ignoreMarkdown,
      json(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
        preventAssignment: true,
      }),
      svelte({
        preprocess: sveltePreprocess(),
        emitCss: true,
        compilerOptions: {
          dev,
          hydratable: true,
        },
      }),
      url({
        sourceDir: path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
      }),
      resolve({
        browser: true,
        preferBuiltins: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({ sourceMap: dev }),

      legacy &&
        babel({
          extensions: [".js", ".mjs", ".html", ".svelte"],
          babelHelpers: "runtime",
          exclude: ["node_modules/@babel/**"],
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead",
              },
            ],
          ],
          plugins: [
            "@babel/plugin-syntax-dynamic-import",
            [
              "@babel/plugin-transform-runtime",
              {
                useESModules: true,
              },
            ],
          ],
        }),

      !dev &&
        terser({
          module: true,
        }),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: { server: config.server.input().server.replace(/\.js$/, ".ts") },
    output: config.server.output(),
    plugins: [
      ignoreMarkdown,
      json(),
      replace({
        "process.browser": false,
        "process.env.NODE_ENV": JSON.stringify(mode),
        preventAssignment: true,
      }),
      svelte({
        preprocess: sveltePreprocess(),
        compilerOptions: {
          generate: "ssr",
          hydratable: true,
          dev,
        },
      }),
      url({
        sourceDir: path.resolve(__dirname, "src/node_modules/images"),
        publicPath: "/client/",
        emitFiles: false, // already emitted by client build
      }),
      resolve({
        preferBuiltins: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
    ],
    external: Object.keys(pkg.dependencies).concat(
      require("module").builtinModules
    ),

    preserveEntrySignatures: "strict",
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input().replace(/\.js$/, ".ts"),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        "process.browser": true,
        "process.env.NODE_ENV": JSON.stringify(mode),
        preventAssignment: true,
      }),
      commonjs(),
      typescript({ sourceMap: dev }),
      !dev && terser(),
    ],

    preserveEntrySignatures: false,
    onwarn,
  },
};
