from flask import Flask, send_from_directory, request
app = Flask(__name__)
app.debug = True


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

