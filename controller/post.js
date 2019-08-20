const Post = require("../model/postModel");

class PostCtl {
  async find(req, res, next) {
    const { per_page = 10 } = req.query;
    const page = Math.round(Math.max(req.query.page * 1, 1)) - 1;
    //为了字符串转数字，所以*1
    const perPage = Math.round(Math.max(per_page * 1, 1));
    const posts = await Post.find({ title: new RegExp(req.query.q) })
      .limit(perPage)
      .skip(page * perPage);
    return res.status(200).json(posts);
  }

  async findById(req, res, next) {
    const { fields = "" } = req.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const post = await Topic.findById(req.params.id).select(selectFields);
    if (post) return res.status(200).json(post);
    return res.status(404).json({ post: "none" });
  }
  async create(req, res, next) {
    const post = await new Post(req.body).save();
    if (post) return res.status(200).json(post);
    return res.status(400).json({ created: "failed" });
  }
  async update(req, res, next) {
    const post = await Topic.findByIdAndUpdate(req.params.id, req.body);
    if (post)
      //更新前得topic
      return res.status(200).json(post);
    return res.status(400).json({ updated: "failed" });
  }
}

module.exports = new PostCtl();
