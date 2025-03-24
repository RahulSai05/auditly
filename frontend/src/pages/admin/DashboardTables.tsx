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
  item_number: string | number;
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
  brands: string[];
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Something went wrong. Please try refreshing the page.
        </div>
      );
    }
    return this.props.children;
  }
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  brands
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
        // Ensure all items have required fields
        const validatedItems = itemsResponse.data.map(item => ({
          ...item,
          item_number: item.item_number || '',
          item_description: item.item_description || '',
          category: item.category || '',
          configuration: item.configuration || '',
          brand: item.brand || { id: 0, brand_name: '', description: '' }
        }));
        setItems(validatedItems);
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
    try {
      return items.filter((item) => {
        // Safely handle all possible null/undefined cases
        const itemNumber = item.item_number?.toString().toLowerCase() || '';
        const searchItemNumber = searchFilters.itemNumber.toLowerCase();
        
        const itemDescription = item.item_description?.toLowerCase() || '';
        const searchItemDescription = searchFilters.itemDescription.toLowerCase();
        
        const brandName = item.brand?.brand_name || '';
        
        const itemCategory = item.category?.toLowerCase() || '';
        const searchCategory = searchFilters.category.toLowerCase();
        
        const itemConfig = item.configuration?.toLowerCase() || '';
        const searchConfig = searchFilters.configuration.toLowerCase();

        return (
          (searchFilters.itemNumber === '' || itemNumber.includes(searchItemNumber)) &&
          (searchFilters.itemDescription === '' || itemDescription.includes(searchItemDescription)) &&
          (searchFilters.brand === '' || brandName === searchFilters.brand) &&
          (searchFilters.category === '' || itemCategory.includes(searchCategory)) &&
          (searchFilters.configuration === '' || itemConfig.includes(searchConfig))
        );
      });
    } catch (error) {
      console.error("Error filtering items:", error);
      return items; // Fallback to showing all items if filtering fails
    }
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
    Array.from(new Set(items.map(item => item.brand?.brand_name).filter(Boolean)), 
    [items]
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* ... (rest of your JSX remains exactly the same) ... */}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardTables;
