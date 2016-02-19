#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

from girder.utility.server import staticFile


def load(info):
    # add static file serving
    app_base = os.path.join(os.curdir, os.pardir)
    app_path = os.path.join(app_base, 'girder', 'plugins', 'multirater-viewer', 'static')

    info['config']['/multirater'] = {
        'tools.staticdir.on': 'True',
        'tools.staticdir.dir': app_path
    }

    # info['serverRoot'].multirater = staticFile(os.path.join(info['pluginRootDir'], 'static', 'index.html'))
