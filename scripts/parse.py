#!/usr/bin/env python
# Filename: parse.py
from lxml import etree

def parseNodes(xml):
  tree = etree.fromstring(xml)
  xp = "//root/data/node/meta/node"
  nodes = tree.xpath(xp)
  return nodes

def parseNodeData(xml):
  tree = etree.fromstring(xml)
  xp = "//root/node/*"
  nodes = tree.xpath(xp)
  return nodes
