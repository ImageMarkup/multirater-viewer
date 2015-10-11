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

@app.route('/new_layout.html')
def dev_view_newlayout():
    return app.send_static_file('new_layout.html')


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
    
    tdff = {}  ##Tile Data for Feature
     
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




def get_AllMarkupData_for_Image( TileDatabase, image_name):
    """returns the tiles marked up for a specific feature"""
    data_for_image = TileDatabase.find({'image_name':image_name})
    ## superpixel ID and user_login_name are the most important
    feature_set = [u'ves_clods', u'str_regblackdots', u'net_targ', u'oth_moth', u'str_hypo_areas', u'str_scar', u'str_irrred', u'str_reg_blotch', u'str_strless', u'str_irrstreaks', u'ves_hel', u'ves_linearbranch', u'str_radialstream', u'ves_coil', u'oth_ulcer', u'str_bluegraydots', u'c_red', u'str_pseudo', u'str_irrblackglob', u'c_dbrown', u'c_bluegray', u'net_atyp', u'c_lbrown', u'ves_comma',u'net_neg', u'str_regbrglob', u'c_white', u'ves_serp', u'str_irrblueglob', u'oth_finger', u'str_regress', u'str_irrbluered', u'str_bluewhite', u'oth_comedo', u'ves_milky', u'str_lines', u'ves_dotted', u'str_chrys', u'oth_spoke', u'c_black', u'ves_hairpin', u'str_irrbrglob', u'str_regbrdots', u'str_clod', u'str_peribrown', u'oth_milia', u'net_pseudo', u'ves_atyp', u'oth_blgrayglob', u'str_rhomb', u'ves_linear', u'oth_ovoids', u'ves_polymorph', u'str_regblueglob', u'oth_cereb', u'str_irrbluedots', u'str_regblackglob', u'str_irrbrdots', u'oth_leaf', u'oth_sharpdemarc', u'oth_lacuna', u'c_gray', u'c_blue',  u'str_streaks', u'net_typ', u'str_periblack', u'str_circle', u'ves_pinkveil', u'str_irreg_blotch',u'str_irrblackdots', u'c_bluewhite', u'str_bluegraygran']  ### Should eventually pull this directly from mong

    
    ### Need to determine best way to structure this... for now I will do it by tile.. then by rater..
    
    tdfaf = {}  ##Tile Data for ALL Features
     
    for rec in data_for_image:
        for k,v in rec.iteritems():
            if k in feature_set:
                if v:
                    ### means the value for this feature is not none... i.e. it was marked up
                    cur_sp = rec['superpixel_id']
                    #print cur_sp,rec
                    if k not in tdfaf:
                        tdfaf[k] = {}  ### Have to create a top level key for the current feature
                    
                    
                    if cur_sp not in tdfaf[k]:  ##Also need to make sure there's a spot for the superpixel
                        tdfaf[k][cur_sp] = {}
                        tdfaf[k][cur_sp][rec['user_login_name']] = v
                    else:
                        ### Need to add data for a second rater...
                        tdfaf[k][cur_sp][rec['user_login_name']] = v
                        
            #    print k,v,
            #elif k not in feature_set:
            #    print k,v,
        #print
    return tdfaf


@app.route('/api/TileInfo')
def TileAPI():
    cur_image = 'UDA2_pilot_008'
    tileData =  get_MarkupData_for_ImageFeature( tile_db, cur_image,'net_atyp')
    return jsonify(**tileData)



@app.route('/api/TileInfo/<string:imageName>')
def TileInfo_for_image( imageName):
    tileData =  get_MarkupData_for_ImageFeature( tile_db, imageName,'net_atyp')
    return jsonify(**tileData)


@app.route('/api/TileInfo/<string:imageName>/<string:featureName>')
def TileInfo_for_image_by_feature( imageName, featureName):
    tileData =  get_MarkupData_for_ImageFeature( tile_db, imageName,featureName)
    return jsonify(**tileData)

@app.route('/api/TileInfo/ALL/<string:imageName>')
def All_TileInfo_for_image( imageName):
    ### This returns information for all features and all tiles in a single dictinoary...
    tileData =  get_AllMarkupData_for_Image( tile_db, imageName)
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
    app.run(host='0.0.0.0',port=1234)

