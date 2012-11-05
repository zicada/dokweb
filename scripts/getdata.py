#!/usr/bin/env python
# Filename: getdata.py
import urllib2
import parse
import string
import os.path

baseurl = "http://api.tiny-solution.com/"
auth = "cf02f72c"
# Where to store our CSV-files
path = "/mnt/iscsi3/data3/dokweb/h2012/dokweb_h124/htdocs/data/"

def getData(url, header):
  req = urllib2.Request(url, None, header)
  try:
    data = urllib2.urlopen(req).read()
  except urllib2.HTTPError, e:
    print "HTTP error: %d" % e.code
  except urllib2.URLError, e:
    print "Network error: %s" % e.reason.args[1]
  return data

# Returns a list of each known node of any type
def getNodes():
  data = getData(baseurl + "network/statsbygg-remmen/nodes?auth=" + auth, {'Accept': 'application/xml'})
  nodes = parse.parseNodes(data)
  return nodes

# Returns fields-data for a given node
def getNodeData(node):
  data = getData(baseurl + "node/" + node + "/messages?auth=" + auth + "&meta=event&date.from=-&fields=co2,temp,moist,movement,light,audio&composite.prefix=_&limit=1", {'Accept': 'application/xml'})
  nodes = parse.parseNodeData(data)
  return nodes

# Deprecated for now, seems easier to get data in xml and generate csv ourselves. 
def getNodeCsvData(node):
  data = getData(baseurl + "node/" + node + "/messages?auth=" + auth + "&meta=event&date.from=-&fields=co2,temp,moist,movement,light,audio&composite.prefix=_&limit=10", {'Accept': 'text/csv'})
  return data

def fileExists(file):
  return os.path.isfile(file)

def writeToFile(file, data):
  f = open(file, 'a')
  f.write(data + "\n")
  f.close()

if __name__ == "__main__":
  nodes = getNodes()
  for n in nodes:
    out = ""
    head = ""
    # Get fielddata for each node (There is no way to ask the API to only return the nodes we want, so we will have to deal with this ourselves)
    data = getNodeData(n.text)
    # Check that we dont store data from dead or uninteresting nodes, then generate / append to CSV
    if len(data) > 5 and data[5].text != "-50":
      for d in data[:-1]:
        out += d.text + ","
        head += d.tag[6:] + "," # cut off the prepending "_field" of this tag
      out += data[-1].text # trick so we dont concat a comma at the end
      head += data[-1].tag[5:] # cut off the prepending "_meta" of this tag
      fname = path + str(n.text) + ".csv"
      # Add header info based on the xml tags if we're creating new files
      if fileExists(fname):
        writeToFile(fname, out)
      else:
        writeToFile(fname, head)
