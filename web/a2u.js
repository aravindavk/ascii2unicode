// ASCII2Unicode Kannada Text Encoding converter
// Copyright (C) 2011, 2012 Aravinda VK <hallimanearavind@gmail.com>
//                                      <http://aravindavk.in>
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

function process_vattakshara(letters, t){
    // Current char is t, which is ASCII code of vattakshara
    // Rearrangement of string needed, If prev char is dependent vowel
    // then it has to be moved after vattakshara
    // If no dependent vowel then it is "ಅ" kaara, Ex: ಕ, ಗ
    // Vattakshara shares same code as of base letter, but halant is added before
    // Ex: ತಿಮ್ಮಿ in ASCII: ತಿ + ಮಿ + ma_vattu
    // in Unicode: ತ + dependent vowel ಇ + ಮ + halant + ಮ + dependent vowel ಇ 

    // Default values
    var last_letter = "";
    var second_last = "";
    var op = "";

    // If atleast one letter in letters, to find the last letter value
    if (letters.length > 0){
        last_letter = letters[letters.length-1];
    }

    // If atleast two letters in letters, to find the second last letter value
    if (letters.length > 1){
        second_last = letters[letters.length-2];
    }

    if (dependent_vowels[last_letter]){
        // If last letter/prev letter to vattakshara is dependent vowel
        // add dependent vowel at the end, after halant + base letter(=vattakshara)
        letters[letters.length-1] = "್";
        letters.push(vattaksharagalu[t]);
        letters.push(last_letter);
    }
    else{
        // If "ಅ" kaara, just append halant + base letter
        // No worry about rearranging
        letters.push("್");
        letters.push(vattaksharagalu[t]);
    }

    // Return converted
    return letters;
}

function process_arkavattu(letters, t){
    // Example: ವರ್ಷ in ASCII ವ + ಷ + arkavattu
    // in Unicode ವ + ರ + halant + ಷ 
    var last_letter = "";
    var second_last = "";

    // If atleast one letter in letters, to find the last letter value    
    if(letters.length > 0){
        last_letter = letters[letters.length-1];
    }

    // If atleast two letters in letters, to find the second last letter value        
    if(letters.length > 1){
        second_last = letters[letters.length-2];
    }

    // Rearrangement according to above example
    if (dependent_vowels[last_letter]){    
        letters[letters.length-2] = ascii_arkavattu[t];
        letters[letters.length-1] = "್";
        letters.push(second_last);
        letters.push(last_letter);
    }
    else{
        letters[letters.length-1] = ascii_arkavattu[t];
        letters.push("್");
        letters.push(last_letter);
    }
    // Return converted
    return letters;
}

function process_broken_cases(letters, t){
    // Since ASCII mapping are based on shapes some of the shapes
    // give trouble with direct conversion
    // Ex: ಕೀರ್ತಿ and ಕೇಳಿ In ASCII: deerga has same code in both but in
    // Unicode both are different, So if prev char is "ಇ" kaara then
    // behave differently and also with "ಎ" kaara
    // Look at the prev char and also current char t and decide on the single unicode
    // dependent vowel and substitute.
    // Note prev char + current char = new char (Except ಉ kaara, ಕು = ಕ + ಉ kaara)
    // since prev char is not dependent vowel


    // Defaults
    var last_letter = "";
    var second_last = "";

    // If atleast one letter in letters, to find the last letter value    
    if(letters.length > 0){
        last_letter = letters[letters.length-1];
    }
        

    // Get dependent vowel mapping with respect to input "t"
    var broken_case_mapping = broken_cases[t]["mapping"];


    if(broken_case_mapping[last_letter]){
        // If mapping exists
        letters[letters.length-1] = broken_case_mapping[last_letter];
    }
    else{
        // For ಉ kaara, no mapping, substitute the value
        letters.push(broken_cases[t]["value"]);
    }
    // Return the converted
    return letters;
}   

function find_mapping(op, txt, current_pos){
    // Finds mapping in reverse order, For Example if input string
    // is abcde then itteration will be for abcde, abcd, abc, ab, a
    // Only when mapping available the index jumps, say if mapping availabale for ab
    // then subtract length of ab while processing next
    
    // Combination length, if length remaining is less than max len then
    // Consider length remaining as max length
    // remaining length = len(txt) - current_pos
    var max_len = 4;
    var remaining = txt.length-current_pos;
    if (remaining < 5){
        max_len = (remaining - 1);
    }

    // Number of letters found mapping, will be returned to caller and
    // used to jump the index (Zero if one char found mapping)
    var n = 0;

    // Loop 4 to 0 or max to 0
    // Controller which checks direct mapping,
    // arkavattu, vattaksharagalu and broken cases
    for(var i = max_len; i >= 0; i--) {
        var substr_till = current_pos + i + 1;
        var t = txt.substring(current_pos, substr_till);

        if(mapping[t]){
            // Direct mapping case
            op.push(mapping[t]);

            // Update Jump by number
            n = i;
            
            // Break and return to caller since we found the mapping
            // for given input
            break;
        }
        else{
            // Try without processing till reaches to last char 
            if (i > 0){
                continue;
            }
            var letters = op.join('').split('');
            // If Last in this batch
            if(ascii_arkavattu[t]){
                // Arkavattu
                op = process_arkavattu(letters, t);
            }
            else if(vattaksharagalu[t]){
                // Vattakshara
                op = process_vattakshara(letters, t);
            }
            else if(broken_cases[t]){
                // Broken cases
                op = process_broken_cases(letters, t);
            }
            else{
                // No match
                op.push(t);
            }
        }
    }    
    return [n, op];
}

function process_word(word){
    // Main program to process the word letter by letter
    
    // Initiate and output Array
    var i = 0;
    var max_len = word.length;
    var op = [];

    while (i < max_len){
        // For each letter in word, jump if data[0] is more than zero

        // If additional chars used in ASCII to improve readability,
        // which doesn't have any significant in Unicode
        if (word[i] in ignore_list){
            i += 1;
            continue;
        }
        // Find the mapping data
        var data = find_mapping(op, word, i);

        // Add to final list
        op = data[1];

        // Jump if data[0]>0 which means found a match for more than
        // one letter combination
        i += (1 + data[0]);
    }

    // Return processed
    return op.join('');
}    

function kn_ascii2unicode(text){
    var words = text.split(' ');

    // To stote converted words
    var op_words = [];

    // Process and append to main array
    words.forEach(function(word, k, arr){
                      op_words.push(process_word(word));                      
                  });

    // Return converted line
    return op_words.join(' ');
}


function converter_init(){
    // Convert array to dict
    var dependent_vowels_temp = dependent_vowels;
    for(i in dependent_vowels_temp){
        dependent_vowels[dependent_vowels_temp[i]] = dependent_vowels_temp[i];
    }

    $("#input-box").focus();
    bind_events();
}

function bind_events(){
    $("#clear-button").click(function(){
                                 $("#input-box").val('').focus();
                             });
    
    $("#convert-button").click(function(){
                                   var unicode_output = kn_ascii2unicode($("#input-box").val());
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