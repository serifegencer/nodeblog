const express = require('express')
const router = express.Router()
const Category = require('../../models/Category')
const Post= require('../../models/Post')
const path = require('path')


router.get('/',(req, res) =>{
  res.render('admin/index')
})

router.get('/categories',(req, res) => {
  Category.find({}).sort({$natural:-1}).lean().then(categories => {
    res.render('admin/categories', {categories:categories})
  })
})

router.post('/categories',(req, res) =>{
       Category.create({
        ...req.body
     }).then(category => {
       if(category){
        res.redirect('categories')
       }
     })
     .catch(err => {
      console.log(err)    
     })   
})
     router.delete('/categories/:id', (req, res) => {
      Category.findByIdAndRemove(req.params.id)
        .then(() => {
          res.redirect('/admin/categories');
        })
  })    
  
  router.get('/posts',(req, res) => {
    Post.find({}).populate({path: 'category', model: Category}).sort({$natural:-1}).lean().then(posts => {
        res.render('admin/posts', {posts:posts})
      })   
 })
  
 router.delete('/posts/:id', (req, res) => {
  Post.findByIdAndRemove(req.params.id).lean()
    .then(() => {
      res.redirect('/admin/posts');
    })
})

router.get('/posts/edit/:id',(req, res) => {
 Post.findOne({_id: req.params.id}).lean().then(post => {
   Category.find({}).lean().then(categories => {
     res.render('admin/editpost', {post:post, categories:categories})
   })
 })
})

router.put('/posts/:id', (req, res)=>{
  let post_image=req.files.post_image
   post_image.mv(path.resolve(__dirname, '../../public/img/postimages', post_image.name))
   
   Post.findOne({_id: req.params.id}).lean().then(post =>{
     post.title = req.body.title
     post.content = req.body.content
     post.date = req.body.date
     post.category = req.body.category
     post.post_image = `/img/postimages/${post_image.name}`
     
     var post = new Post(post)
     post.save().lean().then(post => {
      res.redirect('/admin/posts')
     })

   })

})

module.exports = router
