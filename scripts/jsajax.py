#!/usr/bin/env python

import sys
import json
import cgi
import csv
from commands import getoutput
import datetime

# Path to our csv datafiles
path = "/mnt/iscsi3/data3/dokweb/h2012/dokweb_h124/htdocs/data/";

# Read POST values, use defaults if we're not getting anything
fs = cgi.FieldStorage()

if fs.getvalue('linesToGet'):
  linesToRead = fs.getvalue('linesToGet')
else:
  linesToRead = 4

if fs.getvalue('sensor'):
  sensor = fs.getvalue('sensor')
else:
  sensor = "statsbygg-remmen-209adfaf.csv"

fname = path+sensor

# Use 'tail' to get the last x lines from a given file
def tail(f, n):
  output = getoutput('tail -n %i %s' % (n, f))
  return output.splitlines()

data = tail(fname, int(linesToRead))
# Use csv-reader and assign keys. Since we're using tail, its easiest to use DictReader and assign the keys manually
reader = csv.DictReader(data,fieldnames = ("audio", "co2", "light", "moist", "movement", "temp", "timestamp"))

# Generate json
out = json.dumps( [ row for row in reader ] ) 

print "Content-type: application/json"
print
print out
