#include <iostream>
#include <map>

#include "deps/gbonds-2.0.3/doc-sbw.h"
#include "deps/gbonds-2.0.3/types.h"

using namespace std;

int main(int argc, char *argv[]) {
  if (argc < 2) {
    cout << "usage: sbwcsv yourfile.sbw" << endl;
    return 1;
  }

  gbStatus status;

  auto doc = gb_doc_sbw_open(argv[1], &status);
  if (status != GB_OK)
    return 1;

  // print header
  cout << "SERIES,DENOMINATION,PURCHASE PRICE,SERIAL NUMBER,ISSUE "
          "DATE,MATURITY DATE"
       << endl;
  gbDocBond *bond = nullptr;
  GList *l = nullptr;
  auto count = g_list_length(doc->list);
  for (l = g_list_first(doc->list); l != nullptr; l = g_list_next(l)) {
    bond = static_cast<gbDocBond *>(l->data);
    cout << gb_series_fmt(bond->series) << ",";
    cout << bond->denom << ",";
    cout << bond->issue << ",";
    cout << bond->sn << ",";
    cout << gb_date_fmt(bond->idate) << ",";
    cout << gb_date_fmt(bond->mdate);
    cout << endl;
  }

  return 0;
}
