// util.js

/* Given an array of collections and chunks
 * returns the collections array with chunks and shards
 * appended to each collection. The number of chunks is 
 * appended ot each shard
 */
function formatData(collections, shards, chunks) {
  var data = {};
  data.name = "root";
  data.children = [];

  // Count chunks and shards for each collection
  for (var i in collections) {
    if (collections[i].dropped) continue; //skip dropped collections

    var child = {};
    child.name = collections[i]._id;
    child.shards = [];
    child.size = 0;
    
    // Count chunks
    for (var j in chunks) {
      if (child.name == chunks[j].ns) {
        child.size++;
      }
    }

    // Group a collection's shards and chunks
    for (var k in shards) {
      shards[k].chunks = [];
      for (var l in chunks) {
        if (shards[k]._id == chunks[l].shard && chunks[l].ns == child.name) {
           shards[k].chunks.push(chunks[l]);
        }
      }
      if (shards[k].chunks.length > 0) {
        child.shards.push(new clone(shards[k]));
      }
    }
    
    data.children.push(child);
  }

  return data;
}

/* Given the output of treemap(formatData()), return a list of shards to be used 
   for graphing pie charts 
 */
function formatShards(data) {
  var shards = [];
  var pos = 0;
  for (var i in data) {
    if (!data[i].children) {
      var shard = {};
      shard.data = data[i].data;
      shard.x = data[i].x;
      shard.y = data[i].y;
      shard.dx = data[i].dx;
      shard.dy = data[i].dy;

      // add dx and dy to each shard
      for (var j in shard.data.shards) {
        shard.data.shards[j].dx = data[i].dx;
        shard.data.shards[j].dy = data[i].dy;

      }
      shards[pos++] = shard;
    }
  }
  return shards; 
}

/* Returns a value copy of the given object
 */
function clone(source) {
  for (i in source) {
    if (typeof source[i] == 'source') {
      this[i] = new clone(source[i]);
    }
    else{
      this[i] = source[i];
    }
  }
}

// For cleaning up db json objects; Taken from mongo shell source
var clean = function (s) {s = s.replace(/NumberInt\((\-?\d+)\)/g, "$1");return s;};

// Local storage utils
function getPersistedItem(key) {
    var value;
    try { value = window.localStorage.getItem(key);
    } catch(e) { value = null; }
    if (value) return JSON.parse(value);
    return null;
};

function persistItem(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
};

function removeItem(key) { window.localStorage.removeItem(key); };

// vim: set et sw=2 ts=2;
