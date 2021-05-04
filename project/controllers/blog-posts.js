const BlogPost = require("../models/blog-post");
const successResponse = require("../lib/success-response-sender");
const errorResponse = require("../lib/error-response-sender");
const cron = require("node-cron");
const sendingMail = require("../lib/send-mail");

module.exports = {
  fetchAll: async (req, res) => {
    try {
      const blogPosts = await BlogPost.find()
        .populate("category", "name")
        .populate("user", "full_name", "email");
      successResponse(res, "List of all blog posts", blogPosts);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  fetchOne: async (req, res) => {
    try {
      const blogPost = await BlogPost.findById(req.params.id).populate(
        "category",
        "name"
      );
      if (!blogPost) errorResponse(res, 400, "No user with the provided id");

      successResponse(res, `Post with id #${req.params.id}`, blogPost);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  create: async (req, res) => {
    console.log(req.user);
    try {
      const blogPost = await BlogPost.create(req.body);
      if (blogPost) {
        sendingMail(blogPost.title);
      }

      successResponse(res, "New blog post created and mail is send", blogPost);
    } catch (error) {
      errorResponse(res, 500, error.message);
    }
  },
  patchUpdate: async (req, res) => {
    try {
      const blogPost = await BlogPost.findByIdAndUpdate(
        req.params.id,
        req.body
      );
      successResponse(res, "Blog post updated", blogPost);
    } catch (error) {
      errorResponse(res, 500, {
        ...req.body,
        _id: req.params.id,
        error: error.message,
      });
    }
  },
  putUpdate: async (req, res) => {
    try {
      const blogPost = await BlogPost.findOneAndReplace(
        { _id: req.params.id },
        req.body
      );
      successResponse(res, "Blog post updated", blogPost);
    } catch (error) {
      errorResponse(res, 500, {
        ...req.body,
        _id: req.params.id,
        error: error.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      await BlogPost.remove({ _id: req.params.id });
      res.send(`BlogPost ${req.params.id} is deleted`);
    } catch (error) {
      res.send({ message: error });
    }
  },
  nodeCron: async (req, res) => {
    try {
      await cron.schedule("*/20 * * * * *", async () => {
        const blogPosts = await BlogPost.find();
        const filteredBlogPosts = {};
        blogPosts.forEach((element) => {
          if (element.title === "Zdravo") {
            element.push(filteredBlogPosts);
            console.log(filteredBlogPosts);
          } else {
            return filteredBlogPosts;
          }
        });
      });
      successResponse(filteredBlogPosts);
    } catch (error) {
      errorResponse(res, 500, {
        ...req.body,
        _id: req.params.id,
        error: error.message,
      });
    }
  },
};
