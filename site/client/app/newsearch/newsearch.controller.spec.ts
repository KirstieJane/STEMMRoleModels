'use strict';

describe('Component: NewsearchComponent', function () {

  // load the controller's module
  beforeEach(module('stemmrollmodelsApp'));

  var NewsearchComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    NewsearchComponent = $componentController('NewsearchComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
