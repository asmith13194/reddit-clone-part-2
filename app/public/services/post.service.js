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
      .post('/api/posts',post)
      .then(response=>{
        response.data.vote_count = 0;
        response.data.showCommentsToggle = false;
        response.data.editPostToggle = false;
        response.data.comments=[];
        response.data.time = 'Just now';
        response.data.now = true;
        return response.data;
      });
    };
    this.updatePost = function(post,posty){
      return $http
      .patch('/api/posts/'+posty.id,post)
      .then(response=>{
        post.showCommentsToggle = false;
        posty.editPostToggle = false;
        return response.data;
      });
    };
    this.deletePost = function(post) {
      return $http
      .delete('/api/posts/'+post.id)
      .then(response =>{
        return response.data;
      });
    };
    this.voteUp = function(post) {
      return $http
      .post('api/posts/'+post.id+'/votes')
      .then(response=>{
        post.vote_count = response.data.vote_count;
        return;
      });
    };
    this.voteDown = function(post) {
      return $http
      .delete('api/posts/'+post.id+'/votes')
      .then(response=>{
        post.vote_count = response.data.vote_count;
        return;
      });
    };
  }
}());
