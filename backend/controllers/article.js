"use strict";

let validator = require("validator");
let fs = require("fs");
let path = require("path");

const Article = require("../models/article");

let controller = {
  articleData: (req, res) => {
    let greeting = req.body.greeting;
    return res.status(200).send({
      course: "Ing. Sw II",
      teacher: "Jorge Enrique Otalora",
      student: "Juan Jose Blanco M.",
      greeting: greeting,
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      message: "Soy un test 🕹",
    });
  },
  save: (req, res) => {
    //POST params
    let params = req.body;
    console.log(params);
    //Data validation with validator dependency
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateContent = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(404).send({
        status: "Error",
        message: "Parametros nulos o invalidos",
      });
    }
    if (validateTitle && validateContent) {
      //Create object to save
      let article = new Article();
      //Assign values to object
      article.title = params.title;
      article.content = params.content;
      article.image = null;

      //Save object
      article.save((err, articleStored) => {
        if (err || !articleStored) {
          return res.status(404).send({
            status: "Error ❗",
            message: "Datos no validos",
          });
        }
        return res.status(200).send({
          status: "Success ✔",
          article: articleStored,
        });
      });
    } else {
      return res.status(404).send({
        status: "Error ❗",
        message: "Validacion incorrecta",
      });
    }
    //Response
    return res.status(200).send({
      message: "Soy el save 📋",
    });
  },
  getArticles: (req, res) => {
    //Busqueda de articulos

    let last = req.params.last;
    let query = Article.find({});
    if (last || last != undefined) {
      query.limit(5);
    }

    query.sort("-_id").exec((err, articles) => {
      if (err) {
        return res.status(500).send({
          status: "Error ❗",
          message: "Error en la consulta",
        });
      }
      if (!articles) {
        return res.status(404).send({
          status: "Warning ⚠",
          message: "No hay articulos registrados",
        });
      }
      return res.status(200).send({
        status: "Success ✔",
        articles,
      });
    });
  },
  getArticle: (req, res) => {
    let articleId = req.params.id;
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "Error ❗",
        message: "No existe el articulo",
      });
    }
    Article.findById(articleId, (err, article) => {
      if (err || !article) {
        return res.status(404).send({
          status: "Error ❗",
          message: "No existe el articulo",
        });
      }

      return res.status(200).send({
        status: "Success ✔",
        article,
      });
    });
  },
  update: (req, res) => {
    //Take article id
    let articleId = req.params.id;
    // Take data with put
    let params = req.body;
    //Validate
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateContent = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(500).send({
        status: "Error ❗",
        message: "Datos erroneos o incompletos",
      });
    }

    if (validateTitle && validateContent) {
      //Query and update the result of the query
      Article.findOneAndUpdate(
        { _id: articleId },
        params,
        { new: true },
        (error, articleUpdated) => {
          //If some error with query
          if (error) {
            return res.status(500).send({
              status: "Error ❗",
              message: "Error al actualizar",
            });
          }
          //If article doesn't exist
          if (!articleUpdated) {
            return res.status(404).send({
              status: "Error ❗",
              message: "No existe el articulo solicitado para actualizar",
            });
          }
          //Article updated
          return res.status(200).send({
            status: "Success ✔",
            article: articleUpdated,
          });
        }
      );
    } else {
      return res.status(200).send({
        status: "Error ❗",
        message: "Validacion incorrecta",
      });
    }
    //Response
  },
  delete: (req, res) => {
    let articleId = req.params.id;
    Article.findOneAndDelete({ _id: articleId }, (error, articleDeleted) => {
      if (error) {
        return res.status(500).send({
          status: "Error ❗",
          message: "Error al borrar",
        });
      }

      if (!articleDeleted) {
        return res.status(404).send({
          status: "Error ❗",
          message: "No existe el articulo solicitado para borrar",
        });
      }

      return res.status(200).send({
        status: "Success ✔",
        article: articleRemoved,
      });
    });
  },
  upload: (req, res) => {
    //Configure connect multiparty module

    //Take request file

    var file_name = "Imagen no subida 📲";

    if (!req.files) {
      return res.status(404).send({
        status: "Error ❗",
        message: file_name,
      });
    }
    //Take file name and extension
    let file_path = req.files.file[0].path;
    let file_split = file_path.split("/");

    var file_name = file_split[2];

    //Check extension
    let extension_split = file_name.split(".");
    let file_ext = extension_split[1];

    if (
      file_ext != "png" &&
      file_ext != "jpg" &&
      file_ext != "jpeg" &&
      file_ext != "gif"
    ) {
      // borrar el archivo subido
      fs.unlink(file_path, (err) => {
        return res.status(200).send({
          status: "Error ❗",
          message: "Extension no valida. El archivo sera eliminado.",
        });
      });
    } else {
      var articleId = req.params.id;

      if (articleId) {
        //Search article and assign file route
        Article.findOneAndUpdate(
          { _id: articleId },
          { image: file_name },
          { new: true },
          (err, articleUpdated) => {
            if (err || !articleUpdated) {
              return res.status(500).send({
                status: "Error ❗",
                message: "Error al almacenar la imagen del articulo.",
              });
            }

            return res.status(200).send({
              status: "Success ✔",
              article: articleUpdated,
            });
          }
        );
      } else {
        return res.status(200).send({
          status: "Success ✔",
          image: file_name,
        });
      }
    }
  },
};

module.exports = controller;
