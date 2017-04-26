'use strict';

describe('Component: MultimediaComponent', function () {

  // load the controller's module
  beforeEach(module('stemmrollmodelsApp'));

  var MultimediaComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    MultimediaComponent = $componentController('MultimediaComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
