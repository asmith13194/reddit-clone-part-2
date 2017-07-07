(function(){
  angular.module('app')
  .component('post',{
    templateUrl:'/components/posts/post.template.html',
    controller: controller
  });

  controller.$inject = ['$http']
  function controller($http){
    const vm = this;
    vm.master = [];
    vm.sort = '-vote_count';

    vm.newPostForm = function(){
      if(vm.newPostToggle===true){
        vm.newPostToggle = false;
      }else{
        vm.newPostToggle = true;
      }
    };

    vm.editPostForm = function(posty){
      if(posty.editPostToggle===true){
        posty.editPostToggle = false;
        return;
      }
      else if(posty.showCommentsToggle === true){
        posty.showCommentsToggle = false;
        posty.editPostToggle = true;
        return;
      }
      posty.editPostToggle = true;
    };

    vm.deletePost = function(post){
      $http.delete('/api/posts/'+post.id).then(()=>{
        let postbox = vm.master.indexOf(post);
        vm.master.splice(postbox,postbox+1);
      });
    };

    vm.deleteComment = function(post,comment){
      $http.delete('/api/posts/'+post.id+'/comments/'+comment.id).then(()=>{
        let postbox = vm.master.indexOf(post);
        let commentbox = vm.master[postbox].comments.indexOf(comment);
        vm.master[postbox].comments.splice(commentbox,commentbox+1);
      });
    };

    vm.updateComment = function(post,comment){
      $http.patch('/api/posts/'+post.id+'/comments/'+comment.id,{content:comment.content}).then(response=>{
      });
    };

    vm.createPost = function(post){
      vm.newPostToggle = false;
      // post.comments = [];
      post.vote_count = 0;
      post.showCommentsToggle = false;
      post.editPostToggle = false;
      $http.post('/api/posts',post).then(response=>{
        response.data.comments=[];
        vm.master.unshift(response.data);
      });
    };

    vm.editPost = function(post,posty){
      post.comments = [];
      post.vote_count = 0;
      post.showCommentsToggle = false;
      posty.editPostToggle = false;
      $http.patch('/api/posts/'+posty.id,post).then(response=>{
        vm.master[vm.master.indexOf(posty)].title = response.data.title;
        vm.master[vm.master.indexOf(posty)].author = response.data.author;
        vm.master[vm.master.indexOf(posty)].body = response.data.body;
        vm.master[vm.master.indexOf(posty)].image_url = response.data.image_url;
      });
    };

    vm.showComments = function(posty){
      if(posty.showCommentsToggle === true){
        posty.showCommentsToggle = false;
        return;
      } else if (posty.editPostToggle === true){
        posty.showCommentsToggle = true;
        posty.editPostToggle = false;
        return;
      }
      posty.showCommentsToggle = true;
    };

    vm.createComment = function($event,post,comment){
      let postbox = vm.master.indexOf(post);
      $http.post('/api/posts/'+post.id+'/comments',{content:comment}).then(response=>{
        vm.master[postbox].comments.push(response.data);
      });
    };

    vm.voteUp = function(post){
      $http.post('api/posts/'+post.id+'/votes').then(response=>{
        post.vote_count = response.data.vote_count;
      });
    };

    vm.voteDown = function(post){
      $http.delete('api/posts/'+post.id+'/votes').then(response=>{
        post.vote_count = response.data.vote_count;
      });
    };

    vm.checkSort = function(){
      if(vm.sort==='-vote_count'){
        return 'Votes';
      }else if(vm.sort==='title'){
        return 'Title';
      }
    };

    vm.$onInit = function(){
      $http.get('/api/posts').then(function (response) {
        vm.master = (response.data);
        // vm.master.push({
        //   title: 'Suhh',
        //   body: 'Suhh Dude',
        //   author: 'Suhh Dude',
        //   image_url: "https://www.mememaker.net/static/images/memes/4400130.jpg",
        //   comments: [],
        //   vote_count: 0,
        //   fullDate: new Date().toUTCString(),
        //   day: 30,
        //   date: 'Fri',
        //   month: 'Jun',
        //   year: 2017
        // },{
        //   title: 'Reddit Clone',
        //   body: 'Blackjack and Hookers',
        //   author: 'Bender',
        //   image_url: "http://s2.quickmeme.com/img/e7/e72b69c1ea95f7bed4bf9cdbdc5d4a35a28b3a23e80d12256d5b28633dc799b6.jpg",
        //   comments: [],
        //   vote_count: 0,
        //   fullDate: new Date().toUTCString(),
        //   day: 30,
        //   date: 'Fri',
        //   month: 'Jun',
        //   year: 2017
        // },{
        //   title: 'Pepe Trump',
        //   body: 'Make Reddit Meme Again',
        //   author: 'Pepe',
        //   image_url: "https://cdn.vox-cdn.com/uploads/chorus_asset/file/6666909/pepe-trump.0.png",
        //   comments: [],
        //   vote_count: 0,
        //   fullDate: new Date().toUTCString(),
        //   day: 30,
        //   date: 'Fri',
        //   month: 'Jun',
        //   year: 2017
        // });
      });
    };

  }
}());
