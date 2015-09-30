from flask import Flask, send_from_directory, request,jsonify

app = Flask(__name__)
app.debug = True

import pymongo
## Add in Mongo connection
mongo_con = pymongo.MongoClient('localhost',27017)
db_ptr = mongo_con['TileMarkup_DB']
tile_db = db_ptr['tileLevelData']

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/index_v2.html')
def dev_view():
    return app.send_static_file('index_v2.html')


@app.route('/simple_svg_viewer.html')
def dev_view_svg():
    return app.send_static_file('simple_svg_viewer.html')

@app.route('/osd_svg_viewer.html')
def dev_view_osd_svg():
    return app.send_static_file('osd_svg_viewer.html')


@app.route('/data/<path:path>')
def send_datadir(path):
    return send_from_directory('data', path)


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('js', path)


@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('css', path)


@app.route('/images/<path:path>')
def send_images(path):
    return send_from_directory('images', path)

@app.route('/json_data/<path:path>')
def send_json_data(path):
    return send_from_directory('json_data',path)


def get_MarkupData_for_ImageFeature( TileDatabase, image_name, feature):
    """returns the tiles marked up for a specific feature"""
    data_for_image = TileDatabase.find({'image_name':image_name})
    ## superpixel ID and user_login_name are the most important
    
    
    ### Need to determine best way to structure this... for now I will do it by tile.. then by rater..
    
    tdff = {}  ##Tile Data foe Feature
     
    for rec in data_for_image:
        for k,v in rec.iteritems():
            if k == feature:
                if v:
                    ### means the value for this feature is not none... i.e. it was marked up
                    cur_sp = rec['superpixel_id']
                    #print cur_sp,rec
                    if cur_sp not in tdff:
                        tdff[cur_sp] = {}
                        tdff[cur_sp][rec['user_login_name']] = v
                    else:
                        ### Need to add data for a second rater...
                        tdff[cur_sp][rec['user_login_name']] = v
                        
            #    print k,v,
            #elif k not in feature_set:
            #    print k,v,
        #print
    return tdff


@app.route('/api/TileInfo')
def TileAPI():
    cur_image = 'UDA2_pilot_008'
    tileData =  get_MarkupData_for_ImageFeature( tile_db, cur_image,'net_atyp')
    return jsonify(**tileData)



@app.route('/api/TileInfo/<string:imageName>')
def TileInfo_for_image( imageName):
    tileData =  get_MarkupData_for_ImageFeature( tile_db, imageName,'net_atyp')
    return jsonify(**tileData)




### There's cleatly a better way to do this... i don't want to install nginx on my machine right now though

#@app.route('/images/features_output_dir/<path:path>')
#def send_features(path):
#    return send_from_directory('images', path)

#@app.route('/images/base_img/<path:path>')
#def send_base_images(path):
#    return send_from_directory('images/base_img', path)

#@app.route('/images/features_output_dir/net_typ/<path:path>')
 #def send_net_images(path):
#    return send_from_directory('images/features_output_dir/net_typ', path)


if __name__ == '__main__':
    app.run()

