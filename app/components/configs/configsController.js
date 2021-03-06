angular.module('configs', [])
.controller('ConfigsController', ['$scope', '$stateParams', '$state', 'ConfigService', 'Notifications', 'Pagination',
function ($scope, $stateParams, $state, ConfigService, Notifications, Pagination) {
  $scope.state = {};
  $scope.state.selectedItemCount = 0;
  $scope.state.pagination_count = Pagination.getPaginationCount('configs');
  $scope.sortType = 'Name';
  $scope.sortReverse = false;

  $scope.order = function (sortType) {
    $scope.sortReverse = ($scope.sortType === sortType) ? !$scope.sortReverse : false;
    $scope.sortType = sortType;
  };

  $scope.selectItems = function (allSelected) {
    angular.forEach($scope.state.filteredConfigs, function (config) {
      if (config.Checked !== allSelected) {
        config.Checked = allSelected;
        $scope.selectItem(config);
      }
    });
  };

  $scope.selectItem = function (item) {
    if (item.Checked) {
      $scope.state.selectedItemCount++;
    } else {
      $scope.state.selectedItemCount--;
    }
  };

  $scope.removeAction = function () {
    angular.forEach($scope.configs, function (config) {
      if (config.Checked) {
        ConfigService.remove(config.Id)
        .then(function success() {
          Notifications.success('Config deleted', config.Id);
          var index = $scope.configs.indexOf(config);
          $scope.configs.splice(index, 1);
        })
        .catch(function error(err) {
          Notifications.error('Failure', err, 'Unable to remove config');
        });
      }
    });
  };

  function initView() {
    ConfigService.configs()
    .then(function success(data) {
      $scope.configs = data;
    })
    .catch(function error(err) {
      $scope.configs = [];
      Notifications.error('Failure', err, 'Unable to retrieve configs');
    });
  }

  initView();
}]);
