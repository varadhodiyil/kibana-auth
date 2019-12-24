/**
 * @author  
 *
 * Application plugin and Angular controller.
 */

// import angular from 'angular';
import routes from 'ui/routes';
import chrome from 'ui/chrome';

import { uiModules } from 'ui/modules';

import 'ui/autoload/styles';
import template from '../app.html'

import '../style/app.css';
import '../style/style.css';
// import '../multi-select/scripts/helper.js';
// import {multiselect} from '../multi-select/scripts/multiselect.js';
// import '../multi-select/styles/multiselect.css';
import {Motus} from '../multi-select/scripts/multiselect';


/*
Multi select
*/




/*

End Multi select
*/


















document.title = 'Authentication - Kibana';

var app = uiModules.get('app/kibana-customlogin', []);
routes.enable();
routes.when('/', {
  template: template,
  reloadOnSearch: false
}).when('/admin', {
  template: template,
  reloadOnSearch: false
});
//.otherwise('/admin');
console.log('hello');

app.controller('kibana-customlogin', ($scope, $http) => {


  $scope.logout = () => {
    localStorage.clear();
    $http.post(chrome.addBasePath('/logout'), {}).then(
      function success() {
        window.location = chrome.addBasePath('/');
      },
      function error() {
        window.alert('Not logged in.');
        window.location = chrome.addBasePath('/');
      })
  };
  $scope._visualizition = [];
  $scope.dashboards = [];
  $scope.dashboardsSel = null;
  $scope.AvailableViz = [];
  $scope.dashboardForLevel = [];
  $scope.dashboardForLevel.push(new Array({"dashboardsSel": undefined}));
  $scope.changeViz = (idx, loopVar) => {
    var elem = "multiselect__container" + '__' + loopVar;
    $("#"+elem).empty();
    var Mul_element = document.getElementById(elem);
    // console.log( $scope.dashboardsSel);
    var viz = $scope.dashboards[idx]['references'];
    var _mul_data = [];
    viz.forEach(function(_d){
        var id = _d.id;
        var element = $scope.AvailableViz.filter(e => e.id == id);
        if(element.length > 0) {
          element = element[0];
        console.log(element);
          _mul_data.push({"label": element.attributes.title , "value": _d.id});
        }
        });
        var _select = function(data){
          console.log(data, 'from sel');
          // $scope.VisualizationSelected_Arr = data;
          $scope.dashboardForLevel[loopVar]['dashboard'] =  $scope.dashboards[idx]['id'];
          $scope.dashboardForLevel[loopVar]['visualization'] = data;
        }
        
    Motus.ElementMultiselect.init(Mul_element, _mul_data, _select);
      
  };
  $scope.getDashBardName = (id) => {
    var element = $scope.dashboards.filter(e => e.id == id);
    if(element.length >0) {
      return element[0].attributes.title;
    } 
    return '';
  }
  $scope.init = () => {

    $http.get(chrome.addBasePath('/getcustomsettings')).then(
      function success(request) {
        $scope.customgroups = request.data.groups.customgroups.hits.hits
        $scope.customusers = request.data.groups.customusers.hits.hits
        if ($scope.customgroups.length > 0) $scope.groupForShowingLevels = $scope.customgroups[0]._source;
        console.log("$scope.customgroups", $scope.customgroups)
        console.log("$scope.customusers", $scope.customusers)
        // $scope.groups = request.data.groups;
      },
      function error(err) {
        console.log(err)
        $scope.groups = '';
      });
      var Mul_element = document.getElementById("multiselect__container");
      $scope.VisualizationSelected_Arr = [];
      var _select = function(data){
        console.log(data, 'from sel');
        $scope.VisualizationSelected_Arr = data;
      }
      $http.get(chrome.addBasePath('/api/saved_objects/_find?type=visualization&per_page=1000')).then(function(response){
        $scope.AvailableViz = response.data.saved_objects;
        $scope._visualizition = response.data.saved_objects;
      });
      // $http.get(chrome.addBasePath('/api/saved_objects/_find?type=visualization&per_page=1000')).then(function(response){
      //   $scope._visualizition = response.data.saved_objects;
      //   var _mul_data = [];
      //   $scope._visualizition.forEach(function(_d){
      //     _mul_data.push({"label": _d.attributes.title , "value": _d.id});
      //   });
      //   Motus.ElementMultiselect.init(Mul_element, _mul_data, _select);
      //   // console.log($scope._visualizition);
      //   // multiselect('#VisualizationSelected');
      // },function(error){
      //   console.log(error);
      // });

      $http.get(chrome.addBasePath('/api/saved_objects/_find?type=dashboard&per_page=1000')).then(function(response){
        $scope.dashboards = response.data.saved_objects;
      });

  };
  $scope.getVizualizationName = function(_id){
    var name = '';
    $scope._visualizition.forEach(function(element) {
      if(element.id === _id ){
        name = element.attributes.title;
      }
    });
    return name;
  }

  $scope.addLevelToCurrentGroup = () => {
    if(document.getElementById("addNewLevelInput").value == ""){
      alert("Please eneter the level name")
    }else {
      //$scope.CurrentGroupInLevel.levels[$scope.CurrentGroupInLevel.levels.length] = { "name": document.getElementById("addNewLevelInput").value };
      var select1 = document.getElementById("VisualizationSelected");
      
      // for (var i = 0; i < select1.length; i++) {
      //     if (select1.options[i].selected) VisualizationSelected_Arr.push(select1.options[i].value);
      // }
      // if($scope.VisualizationSelected_Arr.length<=0 )
      // {
      //   alert("Please enter the Visualizations");
      //   return;
      // }
      if(! $scope.validateDashboardSel()){
        return;
      }
      var _dash = $scope.dashboardForLevel.map(e => { 
        var d = {'dashboard' : e.dashboard , 'visualization' :e.visualization };
        return d;
      });
      $scope.CurrentGroupInLevel.levels[$scope.CurrentGroupInLevel.levels.length] = {   
        "name": document.getElementById("addNewLevelInput").value , 
        //"visualization": $scope.VisualizationSelected_Arr,
        // "dashboard": $scope.dashboards[$scope.dashboardsSel].id
        "dashboard":  _dash
      };
      console.log($scope.CurrentGroupInLevel);
      document.getElementById("addNewLevelInput").value = "";
      // document.getElementById("VisualizationSelected").value = "";
     $scope.VisualizationSelected_Arr = [];
     $scope.dashboardsSel = null;
     $("#multiselect__container").empty();
     $scope.dashboardForLevel = [];
    }
    console.log($scope.CurrentGroupInLevel);
    
  };

  $scope.removeLevelForGroup = function(idx){
    console.log(idx);
    console.log($scope.CurrentGroupInLevel);

    var _post = {"remove": idx};
    $http.put(chrome.addBasePath('/updateGroup/'+$scope.CurrentGroupInLevel.name) , _post).then(function(r){
      $scope.CurrentGroupInLevel.levels.splice(idx,1);
    });
  }
  
  $scope.deleteGroup = (index) => {
    if(confirm("Do you want to delete?")){
      
     var data = {
      name: $scope.customgroups[index]._id
     }
     $http.post(chrome.addBasePath('/deletegroup'), data).then(
      function success(response) {
        console.log(response)
        window.location.reload();
        //location.reload();
      },
      function error(err) {
        console.log(err)
        alert("Something went wrong");
      })
    }
  };

  $scope.showLevelPopUp = (index) => {
    $scope.CurrentGroupInLevel = $scope.customgroups[index]._source;
    $scope.showPopup("manageLevelsModal")
  };
  $scope.showPopup = (modalId) => {
    var element = document.getElementById(modalId);
    element.classList.add("show");
    console.log(element)
  };
  $scope.closePopup = (modalId) => {
    var element = document.getElementById(modalId);
    element.classList.remove("show");
    console.log(element)
  };

  $scope.createGroup = () => {
    var data = {
      name: document.getElementById("createGroupNameInput").value
    }
    if(data.name.split(" ").length > 1) {
      alert("White space not allowed in group name")
    } else if(data.name == ""){
      alert("Please eneter the group name")
    }else {
      console.log(data)
      $http.post(chrome.addBasePath('/creategroup'), data).then(
        function success(response) {
          console.log(response)
          location.reload()
        },
        function error(err) {
          console.log(err)
          alert("Something went wrong");
        })
    }
  };
  $scope.validateDashboardSel = () => {
    var elem = $scope.dashboardForLevel[$scope.dashboardForLevel.length-1];
    console.log(elem);
    if(elem.dashboardsSel === undefined ) {
      alert('Please Select an Dashboard');
      return false;
    } 
    if(!elem.visualization || (elem.visualization &&  (elem.visualization.length ==0)) ){
      alert('Please Select Visualizations');
      return false;
    }
    return true;
  }
  $scope.addDashboard = () => {
    if($scope.validateDashboardSel()) {
      $scope.dashboardForLevel.push(new Array({"dashboardsSel": undefined}));
    }
  };


  $scope.updateGroup = () => {
    var data = $scope.CurrentGroupInLevel;
    console.log(data)
    $http.post(chrome.addBasePath('/updategrouplevels'), data).then(
      function success(response) {
        console.log(response)
        location.reload();
      },
      function error(err) {
        console.log(err)
        alert("Something went wrong");
      })
  }



  $scope.groupSelectChanged = () => {
    $scope.groupForShowingLevels = $scope.customgroups[$scope.selectedGroupItem]._source;
  };


  $scope.linkUserPopup = (index) => {
    $scope.selectedUserForLink = $scope.customusers[index]._id
    $scope.showPopup('linkUserModal')
  }
  $scope.unlinkUserPopup = (index) => {
    $scope.selectedUserForLink = $scope.customusers[index]._id
    var data = {
      "username": $scope.selectedUserForLink,
    }
    console.log(data)
    $http.post(chrome.addBasePath('/unlinkUser'), data).then(
      function success(response) {
        console.log(response)
        location.reload();
      },
      function error(err) {
        console.log(err)
        alert("Something went wrong");
      })
  }
  $scope.linkUser = () => {

    var data = {
      "username": $scope.selectedUserForLink,
      "group": $scope.customgroups[$scope.selectedGroupItem]._id,
      "level": $scope.selectedLevelItem
    }
    console.log(data)
    $http.post(chrome.addBasePath('/linkUser'), data).then(
      function success(response) {
        console.log(response)
        location.reload();
      },
      function error(err) {
        console.log(err)
        alert("Something went wrong");
      })
  };

});
