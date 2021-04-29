"use strict";

let express = require("express");
let ArticleController = require("../controllers/article");

let router = express.Router();

let multipart = require("connect-multiparty");
let md_upload = multipart({ uploadDir: "/upload/articles" });

//Test routes
router.post("/data-article", ArticleController.articleData);
router.get("/controller-test", ArticleController.test);

//Util routes
router.post("/save", ArticleController.save);
router.get("/get-articles/:last?", ArticleController.getArticles);
router.get("/get-article/:id", ArticleController.getArticle);
router.put("/update-article/:id", ArticleController.update);
router.delete("/delete-article/:id", ArticleController.delete);
router.post('/upload-image/:id?', md_upload, ArticleController.upload);

module.exports = router;
