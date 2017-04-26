'use strict';
(function(){

class NewsearchComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('stemmrollmodelsApp')
  .component('newsearch', {
    templateUrl: 'app/newsearch/newsearch.html',
    controller: NewsearchComponent
  });

})();
