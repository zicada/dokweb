#!/usr/bin/env python
# Filename = getsensors.py
import json
import os

# Return a list of filenames for each of the sensors so we can populate the <select> element in jquery
files = os.listdir("/mnt/iscsi3/data3/dokweb/h2012/dokweb_h124/htdocs/data")

print "Content-type: application/json"
print
print json.dumps(files)
