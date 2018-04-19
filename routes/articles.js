const express= require('express');
const router = express.Router();


// bring  Article models
let Article = require('../models/article');



router.get('/add',function(req,res){
    res.render('add')
})

router.post('/add',function(req,res){
   let article = new Article(); 
   //use flash message if not given
   article.title =req.body.title;
   article.author =req.body.author;
   article.body = req.body.body;
   article.save(function(err){
       if(err){
           console.log(err);
       }else{
        req.flash('success_msg','Flash Messages are really Cool');
           res.redirect('/');
       }
   })
})

//get single article 
//saving does not return anything but search do
router.get('/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('article',{
            //this article is single one 
            //not an array just console it
            article:article
        })
    });
})

//load Edit form
router.get('/edit/:id',function(req,res){
    Article.findById(req.params.id,function(err,article){
        res.render('edit_article',{
            article:article
        })
    })
})
//update submit
// Model.update(query,object,callback)
router.post('/edit/:id',function(req,res){
    let article ={};
    article.title = req.body.title;
    article.author = req.body._id;
    article.body = req.body.body;
    
    let query = {_id:req.params.id};

    Article.update(query,article,function(err){
        if(err){
            console.log(err);
            return;
        }else{
            
            res.redirect('/')
        }
    })

})
router.get('/delete/:id',function(req,res){
    let query = {_id:req.params.id}
    
    Article.remove(query,function(err){
        if(err){
            console.log(err);
        }else{
        res.redirect('/');
        }
    })
})

module.exports =router;