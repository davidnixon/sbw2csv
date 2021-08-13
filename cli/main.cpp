#include <boost/program_options.hpp>
#include <iostream>
#include <map>
#include <fstream>

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

  // write to a file or stdout if an output file has not been defined
  std::ofstream of;
  std::ostream output(nullptr);
  if (vm.count("output"))
  {
    cout << vm["output"].as<string>() << endl;
    of.open(vm["output"].as<string>(), std::ios::out | std::ios::trunc);
    output.rdbuf(of.rdbuf());
  }
  else
  {
    output.rdbuf(std::cout.rdbuf());
  }

  // print header
  output << "SERIES,DENOMINATION,PURCHASE PRICE,SERIAL NUMBER,ISSUE "
            "DATE,MATURITY DATE"
         << endl;

  // Loop trough the input file and conver each one. Try to be tolerant of errors
  // or bad files.
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
        output << gb_series_fmt(bond->series) << ",";
        output << bond->denom << ",";
        output << bond->issue << ",";
        output << bond->sn << ",";
        output << gb_date_fmt(bond->idate) << ",";
        output << gb_date_fmt(bond->mdate);
        output << endl;
      }
    }
    catch (const std::exception &e)
    {
      std::cerr << "ERROR: " << e.what() << '\n';
    }
  }

  // close the output file if it exists
  if (of.is_open())
  {
    output.flush();
    of.close();
  }

  return 0;
}
