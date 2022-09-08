"use strict";

const router = require("express").Router();
const axios = require("axios");
const expressAsyncHandler = require("express-async-handler");
const { Stream } = require("stream");
const { promisify } = require("util");
const { body, query } = require("express-validator");
const { default: slugify } = require("slugify");
const jimp = require("jimp");

const constants = require("../../constants");
const routeUtils = require("../../utils/route.utils");
const MemesModel = require("../../models/memes.model");

const finished = promisify(Stream.finished);

router.post(
    "/url",
    body("publicId")
        .isString()
        .customSanitizer((value) => slugify(value, constants.SLUGIFY_OPTS))
        .withMessage("Must be a string"),
    body("url")
        .isURL()
        .withMessage("Must be an URL"),
    body("textX")
        .isInt()
        .withMessage("Must be an Integer"),
    body("textY")
        .isInt()
        .withMessage("Must be an Integer"),
    routeUtils.validate,
    expressAsyncHandler(async(req, res, next) => {

        const { publicId, url, textX, textY } = req.body;

        const meme = await MemesModel.addMeme(publicId, url, textX, textY);

        res.json(meme);
    })
);

router.get(
    "",
    query("pageNo")
        .optional()
        .isNumeric()
        .toInt()
        .withMessage("Must be a number"),
    query("pageSize")
        .optional()
        .isNumeric()
        .toInt()
        .withMessage("Must be a number"),
    expressAsyncHandler(async(req, res, next) => {
        const { pageNo = 1, pageSize = 10 } = req.query;

        let page = {};
        const { results: items, total } = await MemesModel
            .query()
            .select()
            .page(pageNo - 1, pageSize);

        if (items.length) {
            page.type = "number";
            page.size = items.length;
            page.current = pageNo;
            // If total possible pages is greater than current page
            // Then more pages are left
            page.hasNext = Math.ceil(total / pageSize) > pageNo;
            page.itemTotal = total;
        }

        return res.json({
            items, page
        });
    })
);

router.get(
    "/:publicId",
    expressAsyncHandler(async(req, res, next) => {
        const { publicId } = req.params;

        const meme = await MemesModel
            .query()
            .select()
            .where("publicId", publicId)
            .first();

        if (!meme) {
            let err = Error(`Meme(publicID:${publicId}) does not exists`);
            err.status = 404;
            throw err;
        }

        let responseReceived;

        const source = axios.CancelToken.source();
        const timeout = setTimeout(() => {
            // If the resource hasn't sent any response
            // after 10 seconds, timeout the request
            if (!responseReceived) {
                source.cancel();
                res.statusCode = 400;
                return res.json({
                    message: "Connection to resource timed out"
                });
            }
        }, constants.DOWNLOAD_TIMEOUT);

        const axiosParams = {
            method: "get",
            responseType: "stream",
            cancelToken: source.token
        };

        res.statusCode = 200;

        return axios.get(meme.url, axiosParams)
            .then(async response => {
                clearTimeout(timeout);
                responseReceived = true;
                res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
                response.data.pipe(res);
                return finished(res);
            })
            .catch(err => {
                err.message = err.message || "Unable to download file";
                throw err;
            });
    })
);

router.get(
    "/:publicId/generate",
    query("text")
        .isString()
        .withMessage("Must be a string"),
    query("textX")
        .optional()
        .isInt()
        .toInt()
        .withMessage("Must be an Integer"),
    query("textY")
        .optional()
        .isInt()
        .toInt()
        .withMessage("Must be an Integer"),
    routeUtils.validate,
    expressAsyncHandler(async(req, res, next) => {
        const { publicId } = req.params;
        const { text, textX, textY } = req.query;

        const meme = await MemesModel
            .query()
            .select()
            .where("publicId", publicId)
            .first();

        if (!meme) {
            let err = Error(`Meme(publicID:${publicId}) does not exists`);
            err.status = 404;
            throw err;
        }

        const font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);

        const image = await jimp.read(meme.url);

        image.print(font, textX || meme.textX, textY || meme.textY, text);

        res.set("Content-Type", "image/jpeg");
        image.getBufferAsync(jimp.MIME_JPEG)
            .then((buffer) => {
                res.status(200).send(new Buffer(buffer));
            });
    })
);

module.exports = router;
