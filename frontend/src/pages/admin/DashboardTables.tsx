import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package2,
  Loader2,
  Users2,
  SlidersHorizontal,
  X,
  FilterX,
  Search,
  Filter,
  ChevronDown,
  Tag,
  Package
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Brand {
  id: number;
  brand_name: string;
  description: string;
}

interface Item {
  id: number;
  item_number: string;
  item_description: string;
  category: string;
  configuration: string;
  brand: Brand;
}

interface SearchFilters {
  itemNumber: string;
  itemDescription: string;
  brand: string;
  category: string;
  configuration: string;
}

interface AdvancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
}) => {
  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-blue-100 p-6 z-50"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-blue-600">
              <SlidersHorizontal className="w-5 h-5" />
              <h3 className="font-semibold">Advanced Search</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <input
                type="text"
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Filter by category..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Package className="w-4 h-4" />
                Configuration
              </label>
              <input
                type="text"
                value={filters.configuration}
                onChange={(e) => handleInputChange('configuration', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Filter by configuration..."
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DashboardTables: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    itemNumber: "",
    itemDescription: "",
    brand: "",
    category: "",
    configuration: "",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get<Item[]>(
          "https://auditlyai.com/api/items"
        );
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const clearFilters = () => {
    setSearchFilters({
      itemNumber: "",
      itemDescription: "",
      brand: "",
      category: "",
      configuration: "",
    });
  };

  const filteredItems = useMemo(() => {
    console.log("Filtering items with filters:", searchFilters);
    return items.filter((item) => {
      const matchesItemNumber = searchFilters.itemNumber === "" ||
        item.item_number.toLowerCase().includes(searchFilters.itemNumber.toLowerCase());
      
      const matchesItemDescription = searchFilters.itemDescription === "" ||
        item.item_description.toLowerCase().includes(searchFilters.itemDescription.toLowerCase());
      
      const matchesBrand = searchFilters.brand === "" ||
        item.brand.brand_name === searchFilters.brand;
      
      const matchesCategory = searchFilters.category === "" ||
        item.category.toLowerCase().includes(searchFilters.category.toLowerCase());
      
      const matchesConfiguration = searchFilters.configuration === "" ||
        item.configuration.toLowerCase().includes(searchFilters.configuration.toLowerCase());

      return matchesItemNumber && 
             matchesItemDescription && 
             matchesBrand &&
             matchesCategory &&
             matchesConfiguration;
    });
  }, [items, searchFilters]);

  const exportToXLSX = (data: Item[]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Item Records");
    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { type: "application/octet-stream" });
    saveAs(blob, "item_records.xlsx");
  };

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50/50">
      {children}
    </th>
  );

  const uniqueBrands = useMemo(() => 
    Array.from(new Set(items.map((item) => item.brand.brand_name))), 
    [items]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-blue-200 transition-all duration-300"
          >
            <Users2 className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Dashboard Items
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            View and manage item information
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-blue-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300"
                    >
                      <Package2 className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Item Records
                    </h2>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                      <FilterX className="w-4 h-4" />
                      Clear Filters
                    </button>
                    <button
                      onClick={() => exportToXLSX(filteredItems)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Export to XLSX
                    </button>
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          <Search className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search by item number..."
                          className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.itemNumber}
                          onChange={(e) => setSearchFilters({ ...searchFilters, itemNumber: e.target.value })}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          <Package className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search by description..."
                          className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.itemDescription}
                          onChange={(e) => setSearchFilters({ ...searchFilters, itemDescription: e.target.value })}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          <Filter className="w-5 h-5" />
                        </div>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 pointer-events-none">
                          <ChevronDown className="w-5 h-5" />
                        </div>
                        <select
                          className="w-full pl-10 pr-10 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl appearance-none focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.brand}
                          onChange={(e) => setSearchFilters({ ...searchFilters, brand: e.target.value })}
                        >
                          <option value="">All Brands</option>
                          {uniqueBrands.map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="md:w-auto">
                      <button
                        onClick={() => setIsAdvancedSearchOpen(!isAdvancedSearchOpen)}
                        className={`w-full md:w-auto px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
                          isAdvancedSearchOpen 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        }`}
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        {isAdvancedSearchOpen ? 'Hide Filters' : 'More Filters'}
                      </button>
                    </div>
                  </div>

                  <AdvancedSearch
                    isOpen={isAdvancedSearchOpen}
                    onClose={() => setIsAdvancedSearchOpen(false)}
                    filters={searchFilters}
                    onFilterChange={setSearchFilters}
                  />
                </div>

                <div className="overflow-hidden rounded-xl border border-blue-100">
                  <div className="overflow-x-auto">
                    <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                      <table className="min-w-full divide-y divide-blue-100">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr>
                            <TableHeader>Item Number</TableHeader>
                            <TableHeader>Description</TableHeader>
                            <TableHeader>Category</TableHeader>
                            <TableHeader>Configuration</TableHeader>
                            <TableHeader>Brand</TableHeader>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                          <AnimatePresence>
                            {filteredItems.length === 0 ? (
                              <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <td
                                  colSpan={5}
                                  className="px-6 py-12 text-center text-gray-500 bg-gray-50/50"
                                >
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <Package className="w-10 h-10 text-gray-400" />
                                    <p className="text-lg font-medium">No matching items found</p>
                                    <p className="text-sm">Try adjusting your search filters</p>
                                    <button
                                      onClick={clearFilters}
                                      className="mt-4 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                                    >
                                      <FilterX className="w-4 h-4" />
                                      Clear all filters
                                    </button>
                                  </div>
                                </td>
                              </motion.tr>
                            ) : (
                              filteredItems.map((item, index) => (
                                <motion.tr
                                  key={item.id}
                                  variants={itemVariants}
                                  custom={index}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                  className="hover:bg-blue-50/50 transition-colors duration-200"
                                  whileHover={{ scale: 1.002 }}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    {item.item_number}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.item_description}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.category}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.configuration}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.brand.brand_name}
                                  </td>
                                </motion.tr>
                              ))
                            )}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardTables;
