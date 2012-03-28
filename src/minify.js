var sys = require('util');
var path = require('path');
var fs = require('fs');
var util = require('util');

var uglify = require("uglify-js");
var jsp = uglify.parser;
var pro = uglify.uglify;

var minifyFile = function(originalFileName,outFileName) {
    var contents = fs.readFileSync(originalFileName).toString();
    console.log("replacing contents");
    contents = contents.replace(/\[(\"i32\",0,0,0,?)+\]/g,"\"i32\"");
    contents = contents.replace(/\[(\"i16\",0,?)+\]/g,"\"i16\"");
    console.log("creating ast");
    var ast = jsp.parse(contents);
    //console.log("lifting");
    //ast = pro.ast_lift_variables(ast);
    console.log("mangling");
    // {mangle:true,toplevel:true,no_functions:false}
    ast = pro.ast_mangle(ast, {mangle:true});
    console.log("squeezing");
    ast = pro.ast_squeeze(ast,{keep_comps:false,dead_code:true});
    console.log("squeezing more");
    ast = pro.ast_squeeze_more(ast);
    console.log("creating final code");
    var final_code = pro.gen_code(ast);
    console.log("compactifying");
    compact = compactify(final_code);
    console.log("compactify small nums to strings");
    compact = smallToStrings(compact);
    console.log("writing to file");
    outFile = fs.openSync(outFileName, 'w+');
    var writeStatus = fs.writeSync(outFile, compact);
    fs.closeSync(outFile);
}

function i2s(intArray) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < intArray.length ) {
        c = intArray[i];
        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if((c > 191) && (c < 224)) {
            c2 = intArray[i+1];
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = intArray[i+1];
            c3 = intArray[i+2];
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }
    return string;
}

function smallToStrings(content) {
    console.log("string tuning");
    var dataArray = content.match(/(\[)([0-9][0-9]?[0-9]?[0-9]?,)+([0-9][0-9]?[0-9]?[0-9]?\])/g);
    
    for(var i=0;i<dataArray.length;i++) {
        data = dataArray[i];
        if(data.length<4) continue;
        
        items = data.match(/[0-9]+[0-9]?[0-9]?[0-9]?/g);
        
        var validUnicode = true;
        var terminatingNull = false;
        
        for(var j=0;j<items.length;j++) {
            var curItem = parseInt(items[j],10);
            
            if(j==items.length-1 && curItem==0) {
                terminatingNull=true;
                items.pop();
            } else if(curItem<33||curItem>126) {
                validUnicode = false;
                break;
            }
        }
        
        if(validUnicode) {
            
            if(terminatingNull) {
                content = content.replace(data,"z(\""+i2s(items).replace(/\"/g,"\\\"")+"\",1)");
            } else {
                content = content.replace(data,"z(\""+i2s(items).replace(/\"/g,"\\\"")+"\")");
            }
        }
    }
    
    var lenbef = content.length;
    content = content.replace(/allocate\(z\(\"([^\"]+)\",1\),\"i8\",ALLOC_STATIC\)/g,"k(\"$1\")");
    console.log("k replacement",lenbef,content.length);
    
    return content;
}

function compactify(content) {
    console.log("compactify");
    var dataArray = content.match(/\[(-?[0-9e]+,0,0,0,?)+\]/g);
    for(var i=0;i<dataArray.length;i++) {
        data = dataArray[i];
        dataClean = data.replace(/(-?[0-9e]+)(,0,0,0)/g, "$1");
        content = content.replace(data,"xc("+dataClean+")");
    }
    
    return content;
}

minifyFile("../cld.js", "../cld-min.js");