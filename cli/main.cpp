#include <boost/program_options.hpp>
#include <iostream>
#include <map>

#include "deps/gbonds-2.0.3/doc-sbw.h"
#include "deps/gbonds-2.0.3/types.h"

using namespace std;
namespace po = boost::program_options;

int main(int argc, char *argv[])
{
  po::options_description desc("Allowed options");
  desc.add_options()("help", "produce help message")(
      "output,o", po::value<string>(), "output file")("input,i", po::value<vector<string>>()->required(), "input files");
  po::positional_options_description p;
  p.add("input", -1);

  po::variables_map vm;
  try
  {
    po::store(
        po::command_line_parser(argc, argv).options(desc).positional(p).run(),
        vm);

    if (vm.count("help"))
    {
      std::cout << "usage: " << desc << std::endl;
      return 0;
    }

    po::notify(vm); // throws error to handle anything else
  }
  catch (po::error &e)
  {
    std::cerr << "ERROR: " << e.what() << std::endl
              << std::endl;
    std::cerr << desc << std::endl;
    return 1;
  }

  // print header
  cout << "SERIES,DENOMINATION,PURCHASE PRICE,SERIAL NUMBER,ISSUE "
          "DATE,MATURITY DATE"
       << endl;
  for (auto sbwfile : vm["input"].as<vector<string>>())
  {
    try
    {
      gbStatus status = GB_OK;

      auto doc = gb_doc_sbw_open(sbwfile.c_str(), &status);
      if (status != GB_OK)
        throw std::invalid_argument(sbwfile);

      gbDocBond *bond = nullptr;
      GList *l = nullptr;
      auto count = g_list_length(doc->list);
      for (l = g_list_first(doc->list); l != nullptr; l = g_list_next(l))
      {
        bond = static_cast<gbDocBond *>(l->data);
        cout << gb_series_fmt(bond->series) << ",";
        cout << bond->denom << ",";
        cout << bond->issue << ",";
        cout << bond->sn << ",";
        cout << gb_date_fmt(bond->idate) << ",";
        cout << gb_date_fmt(bond->mdate);
        cout << endl;
      }
    }
    catch (const std::exception &e)
    {
      std::cerr << "ERROR: " << e.what() << '\n';
    }
  }

  return 0;
}
