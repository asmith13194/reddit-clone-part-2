(function() {
  'use strict';

  angular
    .module('app')
    .service('getAllPostService', service);
    service.$inject = ['$http'];

  function service($http) {
    this.getPosts = function(){
      return $http.get('/api/posts').then(response=>{
        const master = (response.data);
        return master;
        // this.master.forEach(ele=>{
        //   whatTime(ele);
        // });
      });
    };

    // function whatTime(ele){
    //   let now = Date.parse(new Date());
    //   let postTime = Date.parse(ele.created_at);
    //   if(now-postTime>86400000*365){
    //     ele.oneyearplus = true;
    //   }else if(now-postTime>86400000*6){
    //     ele.oneweekplus = true;
    //   }else if(now-postTime>82800000){
    //     ele.twentyfourplus = true;
    //   }else if (Math.floor((now-postTime)/1000/60/60)>86400000/1000/60/60/24){
    //     ele.time = Math.floor((now-postTime)/1000/60/60);
    //     ele.twentyfourless = true;
    //   }else if (Math.floor((now-postTime)/1000/60/60)===1){
    //     ele.time = 1;
    //     ele.onehour = true;
    //   }else if (Math.floor((now-postTime)/1000/60)===0){
    //     ele.time = 'Just now';
    //     ele.now = true;
    //   }else{
    //     if(Math.floor((now-postTime)/1000/60)===1){
    //       ele.time = Math.floor((now-postTime)/1000/60);
    //       ele.oneminute = true;
    //     }else{
    //       ele.time = Math.floor((now-postTime)/1000/60);
    //       ele.onehourless = true;
    //     }
    //   }
    // }
  }

}());
