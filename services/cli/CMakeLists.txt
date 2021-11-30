cmake_minimum_required(VERSION 3.10)

project(sbw2csv)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)
include_directories(
    /usr/include/glib-2.0
    /usr/lib/x86_64-linux-gnu/glib-2.0/include
    /usr/lib64/glib-2.0/include/
)

add_executable(${PROJECT_NAME} "main.cpp"
    "deps/gbonds-2.0.3/doc.c"
    "deps/gbonds-2.0.3/doc-sbw.c"
    "deps/gbonds-2.0.3/types.c"
    "deps/gbonds-2.0.3/marshal.c"
    "deps/gbonds-2.0.3/util.c"
    "deps/gbonds-2.0.3/rules.c"
    "deps/gbonds-2.0.3/table.c"
    "deps/gbonds-2.0.3/table-model.c"
)
# set_target_properties(${PROJECT_NAME} PROPERTIES LINK_SEARCH_START_STATIC 1)
# set_target_properties(${PROJECT_NAME} PROPERTIES LINK_SEARCH_END_STATIC 1)
# set(CMAKE_FIND_LIBRARY_SUFFIXES ".a")
find_library(BOOSTPO
    libboost_program_options.a
    libboost_program_options.so
)
message(STATUS "using ${BOOSTPO}")

target_link_libraries(${PROJECT_NAME} "glib-2.0")
target_link_libraries(${PROJECT_NAME} "gobject-2.0")
target_link_libraries(${PROJECT_NAME} "gcc")
target_link_libraries(${PROJECT_NAME} "stdc++")
target_link_libraries(${PROJECT_NAME} ${BOOSTPO})
# set(CMAKE_EXE_LINKER_FLAGS "-static-libgcc -static-libstdc++")

add_custom_target(clean-all
   COMMAND ${CMAKE_BUILD_TOOL} clean
)