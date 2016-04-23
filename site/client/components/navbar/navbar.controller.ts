'use strict';

class NavbarController {
  //start-non-standard
  menu = [
    {
      'title': 'Home',
      'state': 'main'
    },
    {
      'title': 'All About Us',
      'state': 'allaboutus'
    },
    {
      'title': 'Multimedia',
      'state': 'multimedia'
    },
    {
      'title': 'New Search',
      'state': 'newsearch'
    }
  ];

  isCollapsed = true;
  //end-non-standard

  constructor() {
    }
}

angular.module('stemmrollmodelsApp')
  .controller('NavbarController', NavbarController);
