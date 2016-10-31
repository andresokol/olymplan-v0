var db = require('../middleware/db');

exports.blogList = (req, res) => {
    db.get_table('blogposts').then((result) => {
        console.log(result);
        res.render('blog/list', {
            data: result[0]
        });
    });
}

exports.blogPost = (req, res) => {
    if (isNaN(req.params.postId)) {
        res.send().status(404);
        return;
    }
    res.send(req.params.postId);
}
