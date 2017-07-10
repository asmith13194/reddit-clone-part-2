(function() {
  'use strict';

  angular
    .module('app')
    .service('commentService', service);

    service.$inject = ['$http'];

  function service($http) {
    this.createComment = function(post,comment) {
      return $http
      .post('/api/posts/'+post.id+'/comments',{content:comment})
      .then(response=>{
        return response.data;
      });
    };
    this.updateComment = function(post,comment) {
      let data = {content:comment.content};
      return $http
      .patch('/api/posts/'+post.id+'/comments/'+comment.id,data)
      .then(response=>{
        return;
      });
    };
    this.deleteComment = function(post,comment){
      return $http
      .delete('/api/posts/'+post.id+'/comments/'+comment.id)
      .then(()=>{
        return;
      });
    };
  }
}());
