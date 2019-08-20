const Topic = require("../model/topicModel");
const Post = require("../model/postModel");

class TopicCtl {
  async checkTopicExist(req, res, next) {
    const topic = await Topic.find({ _id: req.params.id });
    if (topic) next();
    else return res.status(404).json({ topic: "not found" });
  }
  async find(req, res, next) {
    try {
      const { per_page = 10 } = req.query;
      const page = Math.round(Math.max(req.query.page * 1, 1)) - 1;
      //为了字符串转数字，所以*1
      const perPage = Math.round(Math.max(per_page * 1, 1));
      const topics = await Topic.find({ name: new RegExp(req.query.q) })
        .limit(perPage)
        .skip(page * perPage);
      return res.status(200).json(topics);
    } catch (err) {
      next(err);
    }
  }

  async findById(req, res, next) {
    const { fields = "" } = req.query;
    const selectFields = fields
      .split(";")
      .filter((f) => f)
      .map((f) => " +" + f)
      .join("");
    const topic = await Topic.findById(req.params.id).select(selectFields);
    if (topic) return res.status(200).json(topic);

    return res.status(404).json({ topic: "none" });
  }
  async create(req, res, next) {
    const topic = await new Topic(req.body).save();
    if (topic) return res.status(200).json(topic);
    return res.status(400).json({ created: "failed" });
  }
  async update(req, res, next) {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body);
    if (topic)
      //更新前得topic
      return res.status(200).json(topic);
    return res.status(400).json({ updated: "failed" });
  }

  async listPosts(req, res, next) {
    const posts = await Post.find({ topics: req.params.id });
    return res.status(200).json(posts);
  }
}

module.exports = new TopicCtl();
