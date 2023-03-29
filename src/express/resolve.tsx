import React from "basicjsx"
import express, { RequestHandler, Request, Response } from "express";
import http from "http";

const app = express()

type dirList = string[]
type resolveTreeFunction = (dir: dirList, q: any, res: any) => void
type resolveTreeItem = resolveTreeFunction | resolveTree
type resolveTree = [resolveTreeFunction, { [key: string]: resolveTreeItem }]
const resTreeTup = {
    Func: 0,
    ResTreeItem: 1
} as const

const a: resolveTreeFunction = (req, q, res) => {
    res.send(req.toString())
}

const b: resolveTreeItem = (req, q, res) => {
    res.send(JSON.stringify(q))
}

const mapDirs: resolveTree = [
    b,
    {
        a: a,
        b: [
            a,
            {
                c: a,
                d: a
            }
        ]
    }
]

const resolveDir = async (dir: dirList, mD: resolveTree = mapDirs) => {
    return new Promise<[resolveTreeFunction, dirList]>((resolve, reject) => {
        if (dir.length == 0) {
            return resolve([mD[resTreeTup.Func], []])
        }
        let newDir = mD[resTreeTup.ResTreeItem][dir[0]]
        let newPath = dir.slice(1)
        if (newDir == null) {
            return resolve([mD[resTreeTup.Func], newPath])
        }
        if (typeof newDir == "function") {
            return resolve([newDir, newPath])
        } else {
            return resolveDir(newPath, newDir).then(resolve).catch(reject)
        }
    })
}

const resolve = async (req: Request, res: Response) => {
    let args = req.params['0'].split("/").slice(1)
    let q = req.query
    if (args.length >= 1 && args[args.length - 1] != "") {
        res.redirect(req.params['0'] + "/")
        return
    }

    resolveDir(args).then(([func, args]) => func(args, q, res)).catch(console.error)
}

export const start = () => {
    app.get("*", resolve)
    http.createServer(app).listen(8080)
}