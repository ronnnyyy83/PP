var addUserPopupHandler = (function () {
    var api = {};
    var _uibModal;
    api.init = function ($uibModal) {
        _uibModal = $uibModal;
    },

    api.openDialog = function () {
        return _uibModal.open({
            templateUrl: 'views/settings/dialogs/addUser.html',
            controller: DialogController,
            backdrop: 'static',
        });
        function DialogController($scope, $uibModalInstance) {
            $scope.toValidate = false
            $scope.validateFields = function () {
                if ($scope.toValidate) {
                    if ($scope.newUser.$error.required && $scope.newUser.$error.required.length > 0) {
                        $scope.isValide.error = true;
                        $scope.isValide.message = "Please Fill All Required Fields"
                    }
                    else if ($scope.newUser.password.$error.required === undefined && $scope.newUser.password.$error.minlength) {
                        $scope.isValide.error = true;
                        $scope.isValide.message = "Password must be at least 6 characters"
                    }
                    else if ($scope.user.password != $scope.user.confirmPassword) {
                        $scope.isValide.error = true;
                        $scope.isValide.message = "Passwords doesn't match"
                        $scope.newUser.password.$error.match = true;
                        $scope.newUser.confirmPassword.$error.match = true;
                    } else {
                        $scope.isValide = { error: false, message: "" };
                        delete $scope.newUser.password.$error['match'];
                        delete $scope.newUser.confirmPassword.$error['match'];

                    }
                }
            }
            $scope.isValide = { error: false, message: "" };
            $scope.user = { userName: "", password: "", confirmPassword: "" };
            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };

            $scope.add = function () {
                $scope.toValidate = true;
                $scope.validateFields();
                if ($scope.isValide.error === false) {
                    $uibModalInstance.close($scope.user);
                }
            }
            //=======================init=========================

        }
    }
    return api;
}());