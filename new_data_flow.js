var username = 'aadikalloo';
var password = prompt('enter', '');  
var token = '';
var study_list = '';
var image_list = '';
var image_list_complete = [];
var annotation_data;
var features = [];

function flatten_it(array) {
  return [].concat.apply([], array);
}

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
token = token.authToken.token;

function get_image_names(array) {
	var image_names = [];
	for (i=0; i<array.length; i++) {
		image_names.push(array[i]['name']);
	}
	return image_names;
}

function get_feature_array(annotation_list_for_current_image) {
  var features = [];
  annotation_id_list = flatten_it(annotation_list_for_current_image.select('_id').toArray());
  num_annotations = annotation_id_list.length;
  for (i=0; i<num_annotations; i++) {
      annotationId = annotation_id_list[i];
      ann = get_user_annotations_for_image(annotationId, token);
      //console.log(ann);
      features.push(ann);
  };
  return features;
}

function get_image_ids(array) {
        var image_names = [];
        for (i=0; i<array.length; i++) {
                image_names.push(array[i]['imageId']);
        }
        return image_names;
}


function unique(array) {
    return $.grep(array, function(el, index) {
        return index === $.inArray(el, array);
    });
}

function get_study_list(token){
  isic_study_endpoint = 'https://isic-archive.com/api/v1/study'
  $.ajax
    ({
      type: "GET",
      url: isic_study_endpoint,
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
  return study_list;
}

function get_user_annotations_for_image(annotation_id, token) {
  var annotation_arr;
  $.ajax
    ({
      type: "GET",
      url: 'https://isic-archive.com/api/v1/annotation/'+annotation_id,
      dataType: 'json',
      async: false,
      data: '',
      beforeSend: function (xhr){
          xhr.setRequestHeader('Girder-Token', token, 'Access-Control-Allow-Origin', '*', 'Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE', 'Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
      },
      success: function (response){
          annotation_arr = response;
      }
  });
  return annotation_arr;
}

function get_annotation_list_for_study_image(study_id, image_id, token) {
  var image_list = '';
  var image_list_complete = [];
  $.ajax
    ({
      type: "GET",
      url: 'https://isic-archive.com/api/v1/annotation',
      dataType: 'json',
      async: false,
      data: 'studyId='+study_id+'&imageId='+image_id,
      beforeSend: function (xhr){
          xhr.setRequestHeader('Girder-Token', token, 'Access-Control-Allow-Origin', '*', 'Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE', 'Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token');
      },
      success: function (response){
          image_list = response;
      }
  });

  images_x = new DataFrame(image_list);
  f = images_x.filter(row => row.get('state') == 'complete');
  console.log(f);

  return f;
}

function get_image_list(study_id, token) {
  var image_list = '';
  var image_list_complete = [];
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

  images_x = new DataFrame(image_list);
  image_list_complete = images_x.filter(row => row.get('state') == 'complete');

  return image_list_complete;
}

//unique_users = $.unique(image_list_complete.map(function (d) {return d.userId;}));


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

function get_annotation_data(annotation_id, token) {
  annotation_data = '';
  $.ajax
    ({
      type: "GET",
      url: 'https://isic-archive.com/api/v1/annotation/'+annotation_id,
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
  return annotation_data;
}

//not_zero = getAllIndexes(annotation_data["annotations"]["pigment_network_reticulation_broadened"], 1);

function get_featureSet_data(featureSetId, token) {
  feature_data = '';
  $.ajax
    ({
      type: "GET",
      url: "https://isic-archive.com/api/v1/featureset/"+featureSetId,
      dataType: 'json',
      async: false,
      data: '',
      beforeSend: function (xhr){ 
          xhr.setRequestHeader('Girder-Token', token, 'Access-Control-Allow-Origin', '*', 'Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE', 'Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token'); 
      },
      success: function (response){
          feature_data = response;
      }
  });
  return feature_data;
}

function get_study_metadata(study_id, token) {
  study_data = '';
  $.ajax
    ({
      type: "GET",
      url: 'https://isic-archive.com/api/v1/study/'+study_id+"?format=json",
      dataType: 'json',
      async: false,
      data: '',
      beforeSend: function (xhr){ 
          xhr.setRequestHeader('Girder-Token', token, 'Access-Control-Allow-Origin', '*', 'Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE', 'Access-Control-Allow-Headers', 'Origin, Content-Type, X-Auth-Token'); 
      },
      success: function (response){
          study_data = response;
      }
  });
  return study_data;
}
