#!/bin/bash

LDFLAGS=-L.
CC=../emscripten/emcc
AR=ar

rm -f *.o
rm -f libcld.a

SOURCES="encodings/compact_lang_det/cldutil.cc \
        encodings/compact_lang_det/cldutil_dbg_empty.cc \
        encodings/compact_lang_det/compact_lang_det.cc \
        encodings/compact_lang_det/compact_lang_det_impl.cc \
        encodings/compact_lang_det/ext_lang_enc.cc \
        encodings/compact_lang_det/getonescriptspan.cc \
        encodings/compact_lang_det/letterscript_enum.cc \
        encodings/compact_lang_det/tote.cc \
        encodings/compact_lang_det/generated/cld_generated_score_quadchrome_0406.cc \
        encodings/compact_lang_det/generated/compact_lang_det_generated_cjkbis_0.cc \
        encodings/compact_lang_det/generated/compact_lang_det_generated_ctjkvz.cc \
        encodings/compact_lang_det/generated/compact_lang_det_generated_deltaoctachrome.cc \
        encodings/compact_lang_det/generated/compact_lang_det_generated_quadschrome.cc \
        encodings/compact_lang_det/win/cld_htmlutils_windows.cc \
        encodings/compact_lang_det/win/cld_unilib_windows.cc \
        encodings/compact_lang_det/win/cld_utf8statetable.cc \
        encodings/compact_lang_det/win/cld_utf8utils_windows.cc \
        encodings/internal/encodings.cc \
        languages/internal/languages.cc"

        #encodings/compact_lang_det/win/cld_unicodetext.cc \

echo
echo "Compile..."
$CC -c -fPIC -I. -DCLD_WINDOWS $SOURCES

echo
echo "Make libcld.a"
$AR rcs libcld.a *.o

echo
echo "Compile cldapp.cc"

# USE_TYPED_ARRAYS=1 & 0 do not work (some languages not detected)
# -02 and -03 are very slow
#$CC -s USE_TYPED_ARRAYS=2 -DCLD_WINDOWS -I. $LDFLAGS -o ../build/cld.html cldapp.cc -lcld -lstdc++ --pre-js assets/pre.js --post-js assets/post.js --compression ../emscripten/third_party/lzma.js/lzma-native,../emscripten/third_party/lzma.js/lzma-decoder.js,LZMA.decompress

#$CC -s USE_TYPED_ARRAYS=2 -O2 --closure 0 -DCLD_WINDOWS -I. $LDFLAGS -o ../build/cld.js cldapp.cc -lcld -lstdc++ --pre-js assets/pre.js --post-js assets/post.js

$CC -s USE_TYPED_ARRAYS=2 -DCLD_WINDOWS -I. $LDFLAGS -o ../cld.js cldapp.cc -lcld -lstdc++ --pre-js assets/pre.js --post-js assets/post.js

rm *.o
rm libcld.a
rm a.out

echo
echo "Done!"
