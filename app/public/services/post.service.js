(function() {
  'use strict';

  angular
    .module('app')
    .service('postService', service);
  service.$inject = ['$http'];

  function service($http) {
    this.getPosts = function() {
      return $http
        .get('/api/posts')
        .then(response => {
          return response.data;
        });
    };
    this.createPost = function(post) {
      return $http
        .post('/api/posts', post)
        .then(response => {
          response.data.vote_count = 0;
          response.data.showCommentsToggle = false;
          response.data.editPostToggle = false;
          response.data.comments = [];
          response.data.time = 'Just now';
          response.data.now = true;
          return response.data;
        });
    };
    this.updatePost = function(post, posty) {
      return $http
        .patch('/api/posts/' + posty.id, post)
        .then(response => {
          post.showCommentsToggle = false;
          posty.editPostToggle = false;
          return response.data;
        });
    };
    this.deletePost = function(post) {
      return $http
        .delete('/api/posts/' + post.id)
        .then(response => {
          return response.data;
        });
    };
    this.voteUp = function(post) {
      return $http
        .post('api/posts/' + post.id + '/votes')
        .then(response => {
          post.vote_count = response.data.vote_count;
          return;
        });
    };
    this.voteDown = function(post) {
      return $http
        .delete('api/posts/' + post.id + '/votes')
        .then(response => {
          post.vote_count = response.data.vote_count;
          return;
        });
    };
    this.checkSort = function(vm) {
      switch (vm.sort) {
        case '-vote_count':
          return 'Votes';
        case 'title':
          return 'Title';
        case '-comments.length':
          return 'Comments';
        case '-created_at':
          return 'Recent';
        case 'created_at':
          return 'Oldest';
      }
    };
    this.postFormToggle = function(vm) {
      switch (vm.newPostToggle) {
        case true:
          vm.newPostToggle = false;
          break;
        case false:
          vm.newPostToggle = true;
          break;
        default:
          vm.newPostToggle = true;
      }
    };
    this.editPostFormToggle = function(posty) {
      switch (posty.editPostToggle) {
        case true:
          posty.editPostToggle = false;
          break;
        case false:
          posty.editPostToggle = true;
          break;
        default:
          posty.editPostToggle = true;
          break;
      }
      switch (posty.showCommentsToggle) {
        case true:
          posty.editPostToggle = true;
          posty.showCommentsToggle = false;
      }
    };
  }
}());
