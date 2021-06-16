#!c:\gb\courses_development\django_2\lesson_1\src_lesson_1\step_1(adapt_to_django_2.0)\geekshop\django_2.0\scripts\python.exe
#
# The Python Imaging Library
# $Id$
#
# convert sequence format to GIF animation
#
# history:
#       97-01-03 fl     created
#
# Copyright (c) Secret Labs AB 1997.  All rights reserved.
# Copyright (c) Fredrik Lundh 1997.
#
# See the README file for information on usage and redistribution.
#

from __future__ import print_function

from PIL import Image

if __name__ == "__main__":

    import sys

    if len(sys.argv) < 3:
        print("GIFMAKER -- create GIF animations")
        print("Usage: gifmaker infile outfile")
        sys.exit(1)

    im = Image.open(sys.argv[1])
    im.save(sys.argv[2], save_all=True)
