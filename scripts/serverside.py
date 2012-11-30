#!/usr/bin/env python

import sys
import os
import csv
from commands import getoutput
import datetime
sys.path.append('pygal-0.13.0-py2.6.egg')
import pygal
from pygal.style import LightSolarizedStyle

# Paths to our csv datafiles and svg images
path = "/mnt/iscsi3/data3/dokweb/h2012/dokweb_h124/htdocs/data/";
imgpath = "../imagedata/"

# Hardcode for 24 hours 
linesToRead = 1440
files = os.listdir(path)
imgfiles = os.listdir(imgpath)

# Embed an svg-object for each sensor generated below
# We have to do this immadiately or calling this file directly from an iframe will throw an error
print "Content-type: text/html"
print
print '<embed src = "' + imgpath + files[0][:-4] + ".svg" + '" type="image/svg+xml" width = "524"/>'
print '<embed src = "' + imgpath + files[1][:-4] + ".svg" + '" type="image/svg+xml" width = "524"/>'
print '<embed src = "' + imgpath + files[2][:-4] + ".svg" + '" type="image/svg+xml" width = "524"/>'
print '<embed src = "' + imgpath + files[3][:-4] + ".svg" + '" type="image/svg+xml" width = "524"/>'
print '<embed src = "' + imgpath + files[4][:-4] + ".svg" + '" type="image/svg+xml" width = "524"/>'

# Add a real name to each of the sensors
def getRealName(name):
  if (name == "statsbygg-remmen-c1140e28"):
    return "Aud max - Oppe"
  if (name == "statsbygg-remmen-209adfaf"):
    return "Aud max - Nede"
  if (name == "statsbygg-remmen-00175c3c"):
    return "FU1-042 - Dramarom"
  if (name == "statsbygg-remmen-e5fb2deb"):
    return "A1-022 - Stipendiatrom"
  if (name == "statsbygg-remmen-4b1c8e6b"):
    return "FU1-041 - Sminkerom"
  return "not found"

for file in files:
  sensor = file
  fname = path+sensor
  outname = file[:-4] + ".svg"

  # Use 'tail' to get the last x lines from a given file
  def tail(f, n):
    output = getoutput('tail -n %i %s' % (n, f))
    return output.splitlines()[::200]

  data = tail(fname, int(linesToRead))

  # Use csv-reader and assign keys. Since we're using tail, its easiest to use DictReader and assign the keys manually
  reader = csv.DictReader(data,fieldnames = ("audio", "co2", "light", "moist", "movement", "temp", "timestamp"))

  # Declare an array for each of the sensortypes
  audio, co2, light, moist, movement, temp, timestamp = [], [], [], [], [], [], []

  # assaign values to each array, make sure we divide co2 by 10 to normalize it.
  for r in reader:
    audio.append(float(r['audio']))
    co2.append(float(r['co2'])/10)
    light.append(float(r['light']))
    moist.append(float(r['moist']))
    movement.append(float(r['movement']))
    temp.append(float(r['temp']))
    # Convert from unixtime and format correctly for 24hr display
    time = datetime.datetime.fromtimestamp(float(r['timestamp']))
    time = time.strftime('%d-%m %H:%M')
    timestamp.append(str(time))

  line_chart = pygal.StackedLine(fill=True, style=LightSolarizedStyle)
  line_chart.title = getRealName(sensor[:-4])
  line_chart.x_labels = timestamp
  line_chart.add('Audio', audio)
  line_chart.add('Co2', co2)
  line_chart.add('Light', light)
  line_chart.add('Moist', moist)
  line_chart.add('Movement', movement)
  line_chart.add('Temp', temp)
  # Write to svg-file, this overwrites the file every time we run.
  # On a system with only userlevel access, make sure to run this as the webserver the first time, so each svg-file is created with the correct ownsership and permissions
  line_chart.render_to_file(imgpath+outname)
