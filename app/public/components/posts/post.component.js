(function() {
  angular
    .module('app')
    .component('post', {
      templateUrl: '/components/posts/post.template.html',
      controller: controller
    });
  controller.$inject = ['postService', 'commentService'];

  function controller(postService, commentService) {
    const vm = this;

    vm.$onInit = function() {
      vm.sort = '-vote_count';
      postService
        .getPosts()
        .then(response => {
          vm.master = response;
          vm.master
            .forEach(ele => {
              whatTime(ele);
            });
        });
    };

    vm.createPost = function(post) {
      vm.newPostToggle = false;
      postService
        .createPost(post)
        .then(response => vm.master.push(response));
    };

    vm.editPost = function(post, posty) {
      postService
        .updatePost(post, posty)
        .then(response => {
          vm.master[vm.master.indexOf(posty)].title = response.title;
          vm.master[vm.master.indexOf(posty)].author = response.author;
          vm.master[vm.master.indexOf(posty)].body = response.body;
          vm.master[vm.master.indexOf(posty)].image_url = response.image_url;
        });
    };

    vm.deletePost = function(post) {
      postService
        .deletePost(post)
        .then(response => {
          let postbox = vm.master.indexOf(post);
          vm.master.splice(postbox, 1);
        });
    };

    vm.createComment = function($event, post, comment) {
      commentService
        .createComment(post, comment)
        .then(response => {
          let postbox = vm.master.indexOf(post);
          vm.master[postbox].comments.push(response);
        });
    };

    vm.updateComment = function(post, comment) {
      commentService
        .updateComment(post, comment)
        .then(response => {});
    };

    vm.deleteComment = function(post, comment) {
      commentService
        .deleteComment(post, comment)
        .then(response => {
          let postbox = vm.master.indexOf(post);
          let commentbox = vm.master[postbox].comments.indexOf(comment);
          vm.master[postbox].comments.splice(commentbox, commentbox + 1);
        });
    };

    vm.voteUp = function(post) {
      postService
        .voteUp(post)
        .then(response => {});
    };

    vm.voteDown = function(post) {
      postService
        .voteDown(post)
        .then(response => {});
    };

    vm.newPostForm = function() {
      return postService
        .postFormToggle(vm);
    };

    vm.editPostForm = function(posty) {
      return postService
        .editPostFormToggle(posty);
    };

    vm.showComments = function(posty) {
      return commentService
      .showComments(posty);
    };

    vm.sortType = function() {
      return postService
      .checkSort(vm);
    };

    function whatTime(ele) {
      let now = Date.parse(new Date());
      let postTime = Date.parse(ele.created_at);
      if (now - postTime > 30879000000) {
        ele.oneyearplus = true;
      } else if (now - postTime > 86400000 * 6) {
        ele.oneweekplus = true;
      } else if (now - postTime > 82800000) {
        ele.twentyfourplus = true;
      } else if (Math.floor((now - postTime) / 3600000) > 1) {
        ele.time = Math.floor((now - postTime) / 3600000);
        ele.twentyfourless = true;
      } else if (Math.floor((now - postTime) / 3600000) === 1) {
        ele.time = 1;
        ele.onehour = true;
      } else if (Math.floor((now - postTime) / 60000) === 0) {
        ele.time = 'Just now';
        ele.now = true;
      } else {
        if (Math.floor((now - postTime) / 60000) === 1) {
          ele.time = Math.floor((now - postTime) / 60000);
          ele.oneminute = true;
        } else {
          ele.time = Math.floor((now - postTime) / 60000);
          ele.onehourless = true;
        }
      }
    }
  }
}());
