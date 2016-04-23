'use strict';
(function(){

class MultimediaComponent {
  constructor() {
    this.message = 'Hello';
  }
}

angular.module('stemmrollmodelsApp')
  .component('multimedia', {
    templateUrl: 'app/multimedia/multimedia.html',
    controller: MultimediaComponent
  });

})();
