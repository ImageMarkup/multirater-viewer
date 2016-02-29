import requests, pymongo, json, bson, gridfs
from isicload_api import *
from secrets import username,password

client = pymongo.MongoClient()
db = client.dsa
fs = gridfs.GridFS(db)

login(username, password)
studies = getStudies()

def addFacets(image):
    image["facets"] = []
    if "clinical" in image["meta"] and "gender" in image["meta"]["clinical"]:
        image["facets"].append("gender:" + image["meta"]["clinical"]["gender"])
    if "clinical" in image["meta"] and "malignant" in image["meta"]["clinical"]:
        image["facets"].append("malignant:" + image["meta"]["clinical"]["malignant"])
    if "clinical" in image["meta"] and "quantloc" in image["meta"]["clinical"]:
        image["facets"].append("quantloc:" + image["meta"]["clinical"]["quantloc"])

    return image

def addThumbnail(image):
    thumbnail = getImageThumbnail(image["_id"]).content
    fs.put(thumbnail, image_id = image["_id"])
    
    return image
    

for study in studies:
    print study["_id"]
    studyImages = getStudyImages(study["_id"])
    for image in studyImages:
        if db.images.find({"_id": image["_id"]}).count() == 0:
            print "\t", image["_id"]
            newImage = addFacets(getImageDetail(image["_id"]))
            addThumbnail(newImage)
            db.images.insert_one(newImage)
