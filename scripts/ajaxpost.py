#!/usr/bin/env python

import sys
import json
import cgi
import gviz_api
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

numdata = tail(fname, int(linesToRead))

# Parse the lines of CSV we have read and store in array. We need to set datatypes for each field or the gviz api will complain.
data = []
for line in numdata:
  bits = line.split(',')
  # Convert from unix epoch to datetime and do some formatting
  time = datetime.datetime.fromtimestamp(float(bits[6]))
  time.strftime('%Y-%m-%d %H:%M:%S')
  # Normalize the co2-values by shifting its decimal to the right (eg devide by 10) as theyre far too high compared to the other numbers. 
  co2 = float(bits[1]) / 10
  # The rest of the values need to be represented as floats so they dont lose any resolution.
  data.append((float(bits[0]),co2,float(bits[2]),float(bits[3]),float(bits[4]),float(bits[5]),time))

# Generate a DataTable object for google charts

description = [("audio","number"),("co2", "number"),("light","number"),("moist","number"),("movement","number"),("temp","number"),("timestamp","datetime")]

data_table = gviz_api.DataTable(description)
data_table.LoadData(data)

# Pass the finished DataTable object to jquery
print "Content-type: application/json"
print
print data_table.ToJSon(columns_order=("timestamp", "light", "co2",  "moist", "movement", "temp", "audio"))
