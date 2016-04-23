'use strict';

describe('Component: AllaboutusComponent', function () {

  // load the controller's module
  beforeEach(module('stemmrollmodelsApp'));

  var AllaboutusComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    AllaboutusComponent = $componentController('AllaboutusComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
