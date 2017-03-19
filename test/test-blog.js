const  blog = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http')
const {app, runServer, closeServer} = require('../server');
const should = chai.should();
chai.use(chaiHttp);

describe('BlogPosts',function(){
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });
  it('should list items to GET', function(){
    return chai.request(app)
      .get('/blog-post')
      .then(function(res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.a('array');
        res.body.length.should.be.at.least(1);
        const expectedKeys = ['title', 'content', 'author', 'publishDate'];
        res.body.forEach(function(item){
          item.should.be.a('object');
          item.should.include.keys(expectedKeys);
        })

      })
    
  });
  it('should add an item on POST', function(){
    const newPost = {title:'Green Eggs and Ham', content:'Riveting coming of age story', author: 'Dr. Seuss', publishDate: '1960'};
    return chai.request(app)
      .post('/blog-post')
      .send(newPost)
      .then(function(res){
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.a('object');
        res.body.should.include.keys('title', 'content', 'author', 'publishDate');
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(Object.assign(newPost, {id: res.body.id}));
      });
  });
  it('should update items on PUT', function(){
    const updateData = {title:'Green Eggs and Ham: Collector\'s edition', content:'Riveting coming of age story. DO NOT MISS!', author: 'Dr. Seuss', publishDate: '1960'};
    return chai.request(app)
      .get('/blog-post')
      then(function(res){
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-post/${updateData.id}`)
          send(updateData)
      })
      .then(function(res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.deep.equal(updateData);
      });
  });
  it('should delete item on DELETE', function(){
    return chai.request(app)
      .get('/blog-post')
      .then(function(res){
        return chai.request(app)
          .delete(`/blog-post/${res.body[0].id}`);
      })
      .then(function(res){
        res.should.have.status(204);
      });

  });

});