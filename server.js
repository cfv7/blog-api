// authors: Ramon & Colin
// date: 3.15.17
// assignment: Blog API
/*-------------------------------*/

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));

BlogPosts.create('don quixote', 'spiritual desert journey', 'miguel de cervantes', 1605);

console.log({BlogPosts});

app.get('/blog-post', (req, res) => {
    res.json(BlogPosts.get());
});

app.post('/blog-post', jsonParser, (req, res)=> {
    const requireFields = ['title', 'content', 'author', 'publishDate'];
    for(let i = 0; i<requireFields.length; i++){
        const field = requireFields[i];
        if(!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(
        req.body.title, req.body.content, req.body.author, req.body.publishDate);
        res.status(201).json(item); 
});

app.delete('/blog-post/:id', (req,res)=> {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog-post \`${req.params.id}\``);
    res.status(204).end();
});

app.put('/blog-post/:id', jsonParser, (req, res) => {
    const requireFields = ['title', 'content', 'author', 'publishDate'];
    for (let i = 0; i<requireFields.length; i++){
        const field = requireFields[i];
        if (!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id){
        const message = (
            `Request path id (${req.params.id}) and request body id `
            `(${req.body.id}) must match`);
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post item \`${req.params.id}\``);
    const updatedItem = BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        publishDate: req.body.publishDate
    });
    res.status(200).json(updatedItem);
});



app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});