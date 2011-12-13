// ASCII2Unicode Kannada Text Encoding converter
// Copyright (C) 2011  Aravinda VK <hallimanearavind@gmail.com>        

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

var Ascii2UnicodeConverter = function(){
    var mappings = {};
    var broken_cases = {};
    var dependent_vowels = {};
    var vattaksharagalu = {};
    var mapNames = {"nudi":"nudi", "baraha":"nudi", "default_map":"nudi"};
    var ignore_list = {};

    function process_word(input_word){
        var i = 0;
        var output = [];
        while (i < input_word.length){
            if (ignore_list[input_word[i]]){
                i++;
                continue;
            }

            for (var j=5; j>0; j--){
                // Process for mapping
                if (mappings[input_word.substring(i, i+j)]){
                    output = output.concat(mappings[input_word.substring(i,i+j)].split(""));
                    i = i + j;
                    break;
                }
                else{
                    // Process for vattakshara
                    if (j == 1 && vattaksharagalu[input_word[i]]){
                        if (dependent_vowels[output[output.length-1]]){
                            var replacement = vattaksharagalu[input_word[i]] + output[output.length -1];
                            output[output.length-1] = "್";
                            output = output.concat(replacement.split(""));
                        }
                        else{
                            output = output.concat(["್",vattaksharagalu[input_word[i]]]);
                        }
                        i++;
                    }
                    // Process for broken things
                    else if (j == 1 && broken_cases[input_word[i]]){
                        if (output[output.length - 1] && broken_cases[input_word[i]]["mapping"][output[output.length - 1]]){
                            var replacement = broken_cases[input_word[i]]["mapping"][output[output.length - 1]];
                            output[output.length-1] = replacement;
                        }
                        else {
                            output = output.concat([broken_cases[input_word[i]]["value"]]);
                        }
                        i++;
                    }
                    // No matching found
                    else if (j == 1){
                        output = output.concat([input_word[i]]);
                        i++;
                    }
                }

            }
        }
        return output.join("");
    }

    function process_line(line){
        var output = [];
        var words = line.split(" ");
        for (i in words){
            var word = words[i];
            output.push(process_word(word));
        }

        return output.join("");
    }


    function convert(mapName, inputTxt){
        var mapDict = {};
        mapName = (mapNames[mapName] ? mapNames[mapName] : mapNames.default_map);

        try {
            mapDict = MapData;
            mappings = mapDict.mappings;
            broken_cases = mapDict.broken_cases;
            var dependent_vowels_temp = mapDict.dependent_vowels;
            for(i in dependent_vowels_temp){
                dependent_vowels[dependent_vowels_temp[i]] = dependent_vowels_temp[i];
            }
            vattaksharagalu = mapDict.vattaksharagalu;
            var ignore_list_temp = mapDict.ignore_list;
            for(i in ignore_list_temp){
                ignore_list[ignore_list_temp[i]] = ignore_list_temp[i];
            }
        }
        catch (x) {
            mapDict = {};
        }

        var unicodeTxt = "";
        var words = inputTxt.split(' ');
        var count = words.length;

        words.forEach(function(word){
                          unicodeTxt += (process_word(word) + " ");
                      });

        return unicodeTxt.replace(/\s*$/, '');
    }

    function init(){
        $("#input-box").focus();
        bind_events();
    }

    function bind_events(){
        $("#clear-button").click(function(){
                                     $("#input-box").val('').focus();
                                 });

        $("#convert-button").click(function(){
                                       var unicode_output = convert("nudi", $("#input-box").val());
                                       $("#output-box").val(unicode_output); 
                                   });

        $(window).scroll(function(){
                             var scroll_top = $(window).scrollTop();

                             if (scroll_top >= 342 && scroll_top < 1140) {
                                 $("#main-menu-bar3").show();
                             }
                             else {
                                 $("#main-menu-bar3").hide();
                             }
                         });
    }

    return {
        "init" : init
    };
};
