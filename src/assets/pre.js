this.detectLanguage = (function() {

    function xc(array) {
        // add three 0-elements after each array element
        var arrayOut = [];
        for(var i=0;i<array.length;i++) {
            arrayOut.push(array[i]);
            arrayOut.push(0);
            arrayOut.push(0);
            arrayOut.push(0);
        }
        return arrayOut;
    }

    function z(string,termination) {
        if(termination) {
            var tmp = s2i(string);
            tmp.push(0);
            return tmp;
        } else {
            return s2i(string);
        }
    }
    
    function k(str) {
        return allocate(/* prevent minify */ z(str,1), "i8", ALLOC_STATIC);
    }
    
    // works with multi-byte unicode characters, unlike
    // intArrayFromString in emscripten.
    //
    // based on: http://www.webtoolkit.info/javascript-utf8.html
    function s2i(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = [];
    
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
    
            if (c < 128) {
                utftext.push(c);
            } else if((c > 127) && (c < 2048)) {
                utftext.push((c >> 6) | 192);
                utftext.push((c & 63) | 128);
            } else {
                utftext.push((c >> 12) | 224);
                utftext.push(((c >> 6) & 63) | 128);
                utftext.push((c & 63) | 128);
            }
        }
        return utftext;
    }
    
    // based on: http://www.webtoolkit.info/javascript-utf8.html
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

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
    }
    
    function _detectLanguage(str) {
        var stack = Runtime.stackSave();
        var retLang = capitaliseFirstLetter(Pointer_stringify(_detectLanguageRaw(allocate(s2i(str), 'i8', ALLOC_STACK))));
        Runtime.stackRestore(stack);
        
        return retLang;
    }

    // HERE STARTS THE GENERATED CODE