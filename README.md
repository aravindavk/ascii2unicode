# ASCII to Unicode Encoding Converter for Kannada.

As of now it works with Nudi and Baraha encoding, This script can convert the text file with Nudi/Baraha encoded text to Unicode.

## Online Use

Online version is available in [http://aravindavk.github.com/ascii2unicode/](http://aravindavk.github.com/ascii2unicode/)

## Usage

    <path to python3> <path to converter.py> <encoding_name> <input_file> <output_file>

Example(Linux Users)

    python3 converter.py nudi sample_input.txt clean_text.txt

Example(Windows users)

    C:\python32\python.exe converter.py nudi sample_input.txt clean_text.txt


## [TODO]

1. Test with Baraha encoding - Completed [May 4th]
2. Analyze and adopt encoding used in KannadaPrabha
3. Fix issues if any
4. Web interface for online use and JSONP API
5. Converter GUI 
