cmake_minimum_required(VERSION 3.16)

project(sbwcsv)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)
include_directories(
    /usr/include/glib-2.0
    /usr/lib/x86_64-linux-gnu/glib-2.0/include
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
target_link_libraries(${PROJECT_NAME} "glib-2.0")
target_link_libraries(${PROJECT_NAME} "gobject-2.0")

add_custom_target(clean-all
   COMMAND ${CMAKE_BUILD_TOOL} clean
)