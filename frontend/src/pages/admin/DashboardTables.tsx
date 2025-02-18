import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Package2, Search, Filter, Loader2 } from "lucide-react";

interface Item {
  id: number;
  item_number: string;
  item_description: string;
  category: string;
}

const DashboardTables: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchItem, setSearchItem] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
        const itemsResponse = await axios.get<Item[]>("http://54.210.159.220:8000/items");
        setItems(itemsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize filtered items
  const filteredItems = useMemo(() => {
    return items
      .filter(
        (item) =>
          (searchItem === "" ||
            String(item.item_number)
              .toLowerCase()
              .includes(searchItem.toLowerCase())) &&
          (categoryFilter === "" || item.category === categoryFilter)
      )
      .slice(0, 5); // Limit to 5 items
  }, [items, searchItem, categoryFilter]);

  // Memoize SearchBar to prevent unnecessary re-renders
  const SearchBar = React.memo(({ 
    value, 
    onChange, 
    placeholder, 
    filter, 
    onFilterChange, 
    filterOptions, 
    filterPlaceholder 
  }) => (
    <div className="flex gap-4 mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          value={value}
          onChange={onChange}
        />
      </div>
      <div className="relative">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <select
          className="pl-10 pr-8 py-2 border rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
          value={filter}
          onChange={onFilterChange}
        >
          <option value="">{filterPlaceholder}</option>
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  ));

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {children}
    </th>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex-1 p-8 bg-gray-50"
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center h-full"
          >
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} className="grid gap-8">
            {/* Items Table */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Package2 className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Items</h2>
                </div>

                <SearchBar
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                  placeholder="Search by Item Number..."
                  filter={categoryFilter}
                  onFilterChange={(e) => setCategoryFilter(e.target.value)}
                  filterOptions={Array.from(new Set(items.map((item) => item.category)))}
                  filterPlaceholder="All Categories"
                />

                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <TableHeader>Item Number</TableHeader>
                          <TableHeader>Description</TableHeader>
                          <TableHeader>Category</TableHeader>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredItems.map((item) => (
                          <motion.tr
                            key={item.id}
                            className="hover:bg-blue-50 transition-colors duration-150"
                            whileHover={{ scale: 1.002 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                              {item.item_number}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.item_description}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {item.category}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardTables;
