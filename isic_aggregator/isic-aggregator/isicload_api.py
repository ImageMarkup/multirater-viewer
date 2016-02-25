
""" This will create a local cached version of the requests that I can use for testing.."""
import requests
##jeckhart/requests-cache   |   0.4.10 | conda           | osx-64
#conda install -c https://conda.anaconda.org/USERNAME PACKAGE

import pymongo
#requests_cache.install_cache('isic_cache')  ##Creates local sqllite database


girder_token = None
def login(username, password):
    login_url = 'https://isic-archive.com/api/v1/user/authentication'
    login_response = requests.get(login_url, auth=(username, password))
    login_response.raise_for_status()
    global girder_token
    girder_token = login_response.json()['authToken']['token']

def apiGet(endpoint, as_json=True):
    url = 'https://isic-archive.com/api/v1/%s' % endpoint
    headers = {}
    global girder_token
    if girder_token:
        headers['Girder-Token'] = girder_token
    response = requests.get(url, headers=headers)
    if as_json:
        return response.json()
    else:
        return response

def getStudies():
    """ Get a list of all studies. """
    return apiGet('study')

def getStudyDetail(study_id):
    """ Get the detailed metadata for a study. """
    return apiGet('study/%s' % study_id)

def getFeaturesetDetail(featureset_id):
    """ Get the details of a featureset. """
    return apiGet('featureset/%s' % featureset_id)

def getStudyUsers(study_id):
    """ Get a list of users in a study. """
    return apiGet('study/%s/users' % study_id)

def getStudyImages(study_id):
    """ Get a list of images in a study. """
    return apiGet('study/%s/images' % study_id)

def getImageDetail(image_id):
    """ Get the detailed metadata for an image. """
    return apiGet('image/%s' % image_id)

def getImageFile(image_id):
    """ Get the original JPEG file for an image. """
    return apiGet('image/%s/download' % image_id, as_json=False)

def getImageThumbnail(image_id, width=None):
    """ Get the thumbnail-size JPEG preview for an image.
        Width defaults to 256 if not specified. """
    url = 'image/%s/thumbnail' % image_id
    if width is not None:
        url += '?width=%s' % width
    return apiGet(url, as_json=False)

def getAnnotations(study_id, user_id=None, image_id=None):
    """ Get the list of annotations for a study (optionally filtering by user or image). """
    url = 'annotation?studyId=' + study_id
    if user_id:
        url += '&userId=' + user_id
    if image_id:
        url += '&imageId=' + image_id
    return apiGet(url)

def getAnnotationDetail(annotation_id):
    """ Get the details of an annotation, including the feature values. """
    return apiGet('annotation/%s' % annotation_id)

def getSegmentationDetail(segmentation_id):
    """ Get the details of a segmentation, including the lesion boundary. """
    return apiGet('segmentation/%s' % segmentation_id)

def getSegmentationSuperpixels(segmentation_id):
    """ Get the PNG-encoded superpixels file for a segmentation. """
    return apiGet('segmentation/%s/superpixels' % segmentation_id, as_json=False)

def getSegmentationThumbnail(segmentation_id, width=None):
    """ Get the a thumbnail-size JPEG preview of the lesion boundary for a segmentation.
    Width defaults to 256 if not specified. """
    url = 'segmentation/%s/thumbnail' % segmentation_id
    if width is not None:
        url += '?width=%s' % width
    return apiGet(url, as_json=False)
