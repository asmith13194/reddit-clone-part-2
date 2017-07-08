(function(){
  angular.module('app')
  .component('post',{
    templateUrl:'/components/posts/post.template.html',
    controller: controller
  });

  controller.$inject = ['$http'];
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

    vm.createPost = function(post){
      vm.newPostToggle = false;
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

    vm.deletePost = function(post){
      $http.delete('/api/posts/'+post.id).then(()=>{
        let postbox = vm.master.indexOf(post);
        vm.master.splice(postbox,1);
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

    vm.updateComment = function(post,comment){
      $http.patch('/api/posts/'+post.id+'/comments/'+comment.id,{content:comment.content}).then(response=>{
      });
    };

    vm.deleteComment = function(post,comment){
      $http.delete('/api/posts/'+post.id+'/comments/'+comment.id).then(()=>{
        let postbox = vm.master.indexOf(post);
        let commentbox = vm.master[postbox].comments.indexOf(comment);
        vm.master[postbox].comments.splice(commentbox,commentbox+1);
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
      });
    };

  }
}());
