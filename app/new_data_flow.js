var username = 'aadikalloo';
var password = prompt('enter', '');  
var token = '';
var study_list = '';
var image_list = '';
var image_list_complete = [];

function make_base_auth(user, password) {
  var tok = user + ':' + password;
  var hash = btoa(tok);
  return "Basic " + hash;
}

$.ajax
  ({
    type: "GET",
    url: "https://isic-archive.com/api/v1/user/authentication",
    dataType: 'json',
    async: false,
    data: '{}',
    beforeSend: function (xhr){ 
        xhr.setRequestHeader('Authorization', make_base_auth(username, password)); 
    },
    success: function (response){
        token = response;
    }
});
token = token.authToken.token

isic_endpoint = 'https://isic-archive.com/api/v1/study'

$.ajax
  ({
    type: "GET",
    url: isic_endpoint,
    dataType: 'json',
    async: false,
    data: 'detail=false',
    beforeSend: function (xhr){ 
        xhr.setRequestHeader('Girder-Token', token, 'Access-Control-Allow-Origin', '*', 'Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE', 'Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token'); 
    },
    success: function (response){
        study_list = response;
    }
});

study_id = study_list[8]['_id']

$.ajax
  ({
    type: "GET",
    url: 'https://isic-archive.com/api/v1/annotation',
    dataType: 'json',
    async: false,
    data: 'studyId='+study_id,
    beforeSend: function (xhr){ 
        xhr.setRequestHeader('Girder-Token', token, 'Access-Control-Allow-Origin', '*', 'Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE', 'Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token'); 
    },
    success: function (response){
        image_list = response;
    }
});

for (i=0; i<image_list.length; i++) {
  if (image_list[i]['state']=='complete') {
    image_list_complete.push(image_list[i])
  }
}

unique_users = $.unique(image_list_complete.map(function (d) {return d.userId;}));
//unique_images = $.unique(image_list_complete.map(function (d) {return d.imageId;}));
//all_images = image_list_complete.map(function (d) {return d.imageId;});
//annotation_ids = $.unique(image_list_complete.map(function (d) {return d._id;}));



function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}



annotation_data = '';
$.ajax
  ({
    type: "GET",
    url: 'https://isic-archive.com/api/v1/annotation/5a283a581165970e4266cfa0',
    dataType: 'json',
    async: false,
    data: '',
    beforeSend: function (xhr){ 
        xhr.setRequestHeader('Girder-Token', token, 'Access-Control-Allow-Origin', '*', 'Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE', 'Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token'); 
    },
    success: function (response){
        annotation_data = response;
    }
});

not_zero = getAllIndexes(annotation_data["annotations"]["pigment_network_reticulation_broadened"], 1);

