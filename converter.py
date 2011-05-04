#!/usr/bin/python3
#-*- coding: utf-8 -*-

# ASCII to Unicode Encoding Converter
# 
# Copyright (C) 2011 by Aravinda VK.<hallimanearavind AT gmail.com>,
# Written by Aravinda <hallimanearavind AT gmail.com>,
#            Sanchaya <dev AT lists.sanchaya.net>
# 
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
# 
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.
#
# You should have received a copy of the GNU Lesser General Public
# License along with this library; if not, write to the Free Software
# Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

import sys
import os

# Where all the mappings files reside
sys.path.append(os.path.join(os.path.dirname(__file__), "mappings"))

def process_word(input_word):
    i = 0
    output = []
    while i < len(input_word):
        # For spacing between two vattakshara some chars used,
        # which are not present in Unicode
        if input_word[i] in ignoreList:
            i += 1
            continue
        
        # Since the mapping combination to represent one entity of Unicode can
        # go upto 5 characters, to match the whole pattern check 5 letter
        # combination lookup if not then 4.. till 1 letter lookup
        for j in [5,4,3,2,1]:

            if input_word[i:i+j] in mappings:
                # If exact mapping available in mapping dictionary
                # Append the converted char to output and proceed
                output += list(mappings[input_word[i:i+j]])
                # Shift as many letters of that combination used in mapping
                i = i + j
                break
            else:
                # Process for vattakshara
                # In ASCII vattakshara has different code than actual char
                # In Unicode to join these vattakshara's with previous string,
                # We need to add halanth to previous char
                # If any dependent vowels used by previous char need be taken out
                # and asign it next to the vattakshara. 
                if j == 1 and input_word[i] in vattaksharagalu:
                    if output[-1] in dependent_vowels:
                        replacement = vattaksharagalu[input_word[i]] + output[-1]
                        output[-1] = "್"
                        output += list(replacement)
                    else:
                        # No dependent vowels means previous char is the letter
                        # which is present in Unicode chart. Since it is complete letter
                        # Vattakshara will not get joined unless we add halanth to it
                        output += ["್",vattaksharagalu[input_word[i]]]
                    i += 1
                elif j == 1 and input_word[i] in broken_cases:
                    # Process for broken things
                    # For example Deergha as in kI is reused while representing kE and kO
                    # In all place this Deerga has same code. By identifying the shape
                    # and dependent vowel used in previous char we can set back actual
                    # Unicode values.
                    # For kI, ki + deerga But Unicode says ka + dependent vowel I 
                    # For kE, ke + deerga But Unicode says ka + dependent vowel E
                    # For kO, ko + deerga But Unicode says ka + dependent vowel O
                    if output[-1] in broken_cases[input_word[i]]["mapping"]:
                        output[-1] = broken_cases[input_word[i]]["mapping"][output[-1]]
                    else :
                        # If previous letter is complete char
                        output += [broken_cases[input_word[i]]["value"]]
                    i += 1
                elif j == 1:
                    # No matching found, Append whatever received 
                    output += [input_word[i]]
                    i += 1

    return "".join(output)
                    

def process_line(line):
    output = []
    words = line.split(" ")
    for word in words:
        output.append(process_word(word))

    return " ".join(output)



if __name__ == "__main__":
    if len(sys.argv) < 4 :
        print ("[ERROR] Usage: ", sys.argv[0], " encoding_name input_file output_file")
    else :
        try:
            input_encoding = __import__(sys.argv[1])
            mappings = input_encoding.mappings
            broken_cases = input_encoding.broken_cases
            dependent_vowels = input_encoding.dependent_vowels
            vattaksharagalu = input_encoding.vattaksharagalu
            ignoreList = input_encoding.ignoreList
        except:
            print ("[ERROR] ", sys.argv[1], " encoding not available")
            exit()
        
        input_file = sys.argv[2]
        output_file = sys.argv[3]
        
        # Open input file in read only mode
        f = open(input_file,encoding="cp1252")

        # Remove the output file if any
        try:
            os.unlink(output_file)
        except:
            print()

        # Open output file in append mode
        f_out = open(output_file, encoding='utf-8', mode='a')

        # Process each line and convert
        for line in f:
            f_out.write(process_line(line))       

        print ("[OK] processed ", input_file, ", Written ", output_file )
