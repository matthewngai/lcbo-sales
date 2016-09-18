define(['constants'], function() {
  angular.module('lsProducts', ['lsConstants'])
    .directive('lsProductTable', function(lsConstants) {
      return {
        restrict: 'E',
        scope: {
          products: '=lsProducts'
        },
        controller: function(lsConstants) {
          var vm = this;

          vm.getLink = function(link) {
            return lsConstants.LCBO_URL + link;
          }

          vm.getOriginalPrice = function(product) {
            var original = Number(product.price.substr(1)) + Number(product.savedPrice.substr(1));
            return '$' + original.toFixed(2);
          }
        },
        bindToController: true,
        controllerAs: 'vm',
        templateUrl: 'templates/product-table.html'
      };
    })
    .directive('lsProductControls', function() {
      return {
        restrict: 'E',
        scope: {
          pageSize: '=lsPageSize',
          pageSizes: '=lsPageSizes',
          pageNumber: '=lsPageNumber',
          count: '=lsCount',
          onPageResize: '&lsOnPageResize'
        },
        bindToController: true,
        controller: function() {
          var vm = this;

          vm.hasPrevious = function() {
            return vm.pageNumber > 0;
          }

          vm.hasNext = function() {
            return vm.count > (vm.pageNumber + 1) * vm.pageSize;
          }

          vm.previousPage = function() {
            if (vm.hasPrevious()) {
              vm.pageNumber--;
              vm.pageResize();
            }
          }

          vm.nextPage = function() {
            if (vm.hasNext()) {
              vm.pageNumber++;
              vm.pageResize();
            }
          }

          vm.getStart = function() {
            var start = vm.pageNumber * vm.pageSize;
            return Math.min(start + 1, vm.count);
          }

          vm.getEnd = function() {
            var end = (vm.pageNumber + 1) * vm.pageSize;
            return Math.min(end, vm.count);
          }

          vm.onClose = function() {
            vm.pageResize();
          }

          vm.pageResize = function() {
            vm.onPageResize({page: vm.pageNumber});
          }
        },
        controllerAs: 'vm',
        link: function(scope, element, attrs) {

        },
        templateUrl: 'templates/product-controls.html'
      };
    });
});