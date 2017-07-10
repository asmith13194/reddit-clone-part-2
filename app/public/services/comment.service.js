(function() {
  'use strict';

  angular
    .module('app')
    .service('commentService', service);

  service.$inject = ['$http'];

  function service($http) {
    this.createComment = function(post, comment) {
      return $http
        .post('/api/posts/' + post.id + '/comments', {
          content: comment
        })
        .then(response => {
          return response.data;
        });
    };
    this.updateComment = function(post, comment) {
      let data = {
        content: comment.content
      };
      return $http
        .patch('/api/posts/' + post.id + '/comments/' + comment.id, data)
        .then(response => {
          return;
        });
    };
    this.deleteComment = function(post, comment) {
      return $http
        .delete('/api/posts/' + post.id + '/comments/' + comment.id)
        .then(() => {
          return;
        });
    };
    this.showComments = function(posty) {
      switch (posty.showCommentsToggle) {
        case true:
          posty.showCommentsToggle = false;
          break;
        case false:
          posty.showCommentsToggle = true;
          break;
        default:
          posty.showCommentsToggle = true;
          break;
      }
      switch (posty.editPostToggle) {
        case true:
          posty.showCommentsToggle = true;
          posty.editPostToggle = false;
      }
    };
  }
}());
