var fs = require("fs");
var data = require('./metricscache.json');
var merges = fs.readFileSync("merges.csv", {encoding: "utf8"}).split("\n");

var commits = [];
merges.forEach(function(row){
	var p = row.split(" ",2);
	var message = row.substr(52);
	commits.push({
		sha: p[0],
		date: new Date(p[1]*1000),
		unix: p[1],
		message: message
	})
});

// for(var sha in data.commits){
// 	//if(data.commits[sha].x < 10)
// 		commits[data.commits[sha].x] = data.commits[sha];
// }

var modules = {};
for(var x in commits){
	try {
	Object.keys(data.modules[commits[x].sha] || {}).forEach(function(module){
		if(!modules[module])
			modules[module] = [];
	});
	} catch(e){
		console.log("Error", x, commits[x], e);
	}
}

var headers = ["x", "commit"];
for(var name in modules){
	headers.push(name);
}
console.log(headers.join("\t"));

for(var x in commits){
	var locs = [x, commits[x].sha];
	for(var name in modules){
		if(data.modules[commits[x].sha]){
			var m = data.modules[commits[x].sha][name];
			locs.push(m && m.loc || 0);
		} else {
			locs.push(0);
		}
	}
	console.log(locs.join("\t"));
}