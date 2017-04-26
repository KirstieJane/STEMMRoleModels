'use strict';
(function(){

class AllaboutusComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('stemmrollmodelsApp')
  .component('allaboutus', {
    templateUrl: 'app/allaboutus/allaboutus.html',
    controller: AllaboutusComponent
  });

})();
