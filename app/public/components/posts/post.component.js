(function(){
  angular.module('app')
  .component('post',{
    templateUrl:'/components/posts/post.template.html',
    controller: controller
  });

  controller.$inject = ['$http'];
  function controller($http){
    const vm = this;

    vm.$onInit = function(){
      $http.get('/api/posts').then(function (response) {
        vm.sort = '-vote_count';
        vm.master = (response.data);
        vm.master.forEach(ele=>{
          whatTime(ele);
        });
      });
    };

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
        response.data.time = 'Just now';
        response.data.now = true;
        vm.master.push(response.data);
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
      }else if(vm.sort==='-comments.length'){
        return 'Comments';
      }else if(vm.sort==='-created_at'){
        return 'Recent';
      }
    };

    function whatTime(ele){
      let now = Date.parse(new Date());
      let postTime = Date.parse(ele.created_at);
      if(now-postTime>86400000*365){
        ele.oneyearplus = true;
      }else if(now-postTime>86400000*6){
        ele.oneweekplus = true;
      }else if(now-postTime>82800000){
        ele.twentyfourplus = true;
      }else if (Math.floor((now-postTime)/1000/60/60)>86400000/1000/60/60/24){
        ele.time = Math.floor((now-postTime)/1000/60/60);
        // switch (Math.floor((now-postTime)/1000/60/60)) {
        //   case 2:
        //     ele.time = 2;
        //     break;
        //   case 3:
        //     ele.time = 3;
        //     break;
        //   case 4:
        //     ele.time = 4;
        //     break;
        //   case 5:
        //     ele.time = 5;
        //     break;
        //   case 6:
        //     ele.time = 6;
        //     break;
        //   case 7:
        //     ele.time = 7;
        //     break;
        //   case 8:
        //     ele.time = 8;
        //     break;
        //   case 9:
        //     ele.time = 9;
        //     break;
        //   case 10:
        //     ele.time = 10;
        //     break;
        //   case 11:
        //     ele.time = 11;
        //     break;
        //   case 12:
        //     ele.time = 12;
        //     break;
        //   case 13:
        //     ele.time = 13;
        //     break;
        //   case 14:
        //     ele.time = 14;
        //     break;
        //   case 15:
        //     ele.time = 15;
        //     break;
        //   case 16:
        //     ele.time = 16;
        //     break;
        //   case 17:
        //     ele.time = 17;
        //     break;
        //   case 18:
        //     ele.time = 18;
        //     break;
        //   case 19:
        //     ele.time = 19;
        //     break;
        //   case 20:
        //     ele.time = 20;
        //     break;
        //   case 21:
        //     ele.time = 21;
        //     break;
        //   case 22:
        //     ele.time = 22;
        //     break;
        //   case 23:
        //     ele.time = 23;
        //     break;
        // }
        ele.twentyfourless = true;
      }else if (Math.floor((now-postTime)/1000/60/60)===1){
        ele.time = 1;
        ele.onehour = true;
      }else if (Math.floor((now-postTime)/1000/60)===0){
        ele.time = 'Just now';
        ele.now = true;
      }else{
        if(Math.floor((now-postTime)/1000/60)===1){
          ele.time = Math.floor((now-postTime)/1000/60);
          ele.oneminute = true;
        }else{
          ele.time = Math.floor((now-postTime)/1000/60);
          ele.onehourless = true;
        }
      }
    }

  }
}());
