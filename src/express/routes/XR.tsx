import { resolveTreeFunction } from "../resolve"
// I built this package
// Built by [redacted] (tnichols217) at https://www.npmjs.com/package/basicjsx
import React from "basicjsx"
import { CustomElements } from "basicjsx"
//@ts-ignore
import main from "./main.client"
//@ts-ignore
import css from "./main.css"

export const wrapFunction = (func: any, args : string) => {
    console.log(func)
    return `(${func.toString()})(${args})`
}

const JS = (props, children) => {
    let str = `(${props.js.toString()})()`
    delete props.js
    let out = React.createElement("script", props, [str as any])
    return out
}

const OBJ = (props, children) => {
    let str = JSON.stringify(props.json)
    return str
}

const ImportMap = {
    "imports": {
        "three": "https://unpkg.com/three@0.151.3/build/three.module.js",
        "three/addons/": "https://unpkg.com/three@0.151.3/examples/jsm/",
        "postprocessing": "https://unpkg.com/postprocessing@6.30.2/build/postprocessing.mjs",
        "realism-effects": "https://unpkg.com/realism-effects@1.0.19/dist/index.js"
    }
}

//enable polyfill if importmaps arent available
const Head = () => 
<head>
    {/* <script async src="https://ga.jspm.io/npm:es-module-shims@1.7.1/dist/es-module-shims.js"></script> */}
    <script type="importmap">
        {JSON.stringify(ImportMap)}
    </script>
    <style>
        {css}
    </style>
</head>

const Body = () => <body>
    <script type="module">
        {Buffer.from(main, 'base64').toString()}
    </script>
    <div id="drop_zone" ondrop="window.dropHandler(event);" ondragover="window.dragOverHandler(event);">
    </div>
</body>

export const resolve: resolveTreeFunction = (dir, query, res) => {
    let ret = <html>
        <Head />
        <Body />
    </html>
    res.send("<!DOCTYPE html>" + ret.outerHTML)
}