

import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { 
  Search, 
  Loader2, 
  X, 
  ClipboardList, 
  SlidersHorizontal,
  Tag,
  Package,
  FilterX,
  MapPin,
  CheckCircle,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';

interface ShippingInfo {
  shipped_to_person: string;
  address: string;
  city: string;
  state: string;
  country: string;
  organization?: string;
}

interface ReceiptData {
  item_description: string;
  brand_name: string;
  overall_condition: string;
  return_order_number: string;
  original_sales_order_number: string;
  return_qty: number;
  receipt_number: string;
  shipping_info: ShippingInfo;
  images: {
    difference_images: {
      front: string;
      back: string;
    };
    similarity_scores: {
      front: string;
      back: string;
      average: string;
    };
    base_images?: {
      front: string;
      back: string;
    };
  };
}

interface SearchFilters {
  receiptNumber: string;
  returnOrderNumber: string;
  itemDescription: string;
  productCondition: string;
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
  const handleInputChange = (field: keyof SearchFilters, value: any) => {
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
                Return Order #
              </label>
              <input
                type="text"
                value={filters.returnOrderNumber}
                onChange={(e) => handleInputChange('returnOrderNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Enter return order number..."
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Package className="w-4 h-4" />
                Item Description
              </label>
              <input
                type="text"
                value={filters.itemDescription}
                onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                placeholder="Enter item description..."
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ImageViewerModal = ({ 
  images, 
  onClose 
}: { 
  images: {
    difference_images: {
      front: string;
      back: string;
    };
    similarity_scores: {
      front: string;
      back: string;
      average: string;
    };
    base_images?: {
      front: string;
      back: string;
    };
  }; 
  onClose: () => void 
}) => {
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [imageType, setImageType] = useState<'difference' | 'base'>('difference');
  const [imageLoadState, setImageLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');

  const getImageUrl = () => {
    if (imageType === 'difference') {
      return activeTab === 'front' 
        ? images.difference_images.front
        : images.difference_images.back;
    } else if (images.base_images) {
      return activeTab === 'front'
        ? images.base_images.front
        : images.base_images.back;
    }
    return null;
  };

  const currentImageUrl = getImageUrl();

  useEffect(() => {
    setImageLoadState('loading');
  }, [currentImageUrl, imageType]);

  const handleImageLoad = () => {
    setImageLoadState('loaded');
  };

  const handleImageError = () => {
    setImageLoadState('error');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-200 p-4">
          <div className="flex items-center gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'front' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setActiveTab('front')}
            >
              Front View
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'back' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setActiveTab('back')}
            >
              Back View
            </button>
          </div>
          {images.base_images && (
            <div className="flex items-center gap-4">
              <button
                className={`px-4 py-2 rounded-lg ${imageType === 'difference' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setImageType('difference')}
              >
                Difference
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${imageType === 'base' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setImageType('base')}
              >
                Base
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 flex items-center justify-center">
          <div className="relative w-full max-w-2xl">
            {imageLoadState === 'error' || !currentImageUrl ? (
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-gray-500">
                  {!currentImageUrl ? 'Image not available' : 'Failed to load image'}
                </p>
              </div>
            ) : (
              <>
                {imageLoadState === 'loading' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  </div>
                )}
                <img
                  src={currentImageUrl}
                  alt={`${activeTab} ${imageType} view`}
                  className={`w-full h-auto rounded-lg shadow-lg border border-gray-200 ${
                    imageLoadState === 'loaded' ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </>
            )}
            <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-lg shadow-sm">
              <span className="text-sm font-medium">
                {activeTab === 'front' ? 'Front' : 'Back'} {imageType === 'difference' ? 'Difference' : 'Base'}
              </span>
            </div>
            {imageType === 'difference' && (
              <div className="absolute bottom-4 right-4 bg-white/90 px-3 py-1 rounded-lg shadow-sm">
                <span className="text-sm font-medium">
                  Similarity: {activeTab === 'front' 
                    ? images.similarity_scores.front 
                    : images.similarity_scores.back}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AuditlyInspection = () => {
  const [data, setData] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ReceiptData | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    receiptNumber: "",
    returnOrderNumber: "",
    itemDescription: "",
    productCondition: "",
  });
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

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
    const fetchAllData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post<ReceiptData[]>("https://auditlyai.com/api/get-inspection-data", {
          receipt_number: null,
          organization: localStorage.getItem("organization") || "", 
        });
        
        const uniqueData = response.data.reduce((acc: ReceiptData[], current) => {
          const existingIndex = acc.findIndex(item => 
            item.receipt_number === current.receipt_number && 
            item.return_order_number === current.return_order_number
          );
          
          if (existingIndex === -1) {
            acc.push(current);
          } else {
            if (current.images?.base_images?.front && current.images?.base_images?.back) {
              if (!acc[existingIndex].images?.base_images?.front || 
                  !acc[existingIndex].images?.base_images?.back) {
                acc[existingIndex] = current;
              }
            }
          }
          return acc;
        }, []);
        
        setData(uniqueData);
      } catch (error) {
        console.error("Error fetching details:", error);
        setError("Failed to fetch details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesReceiptNumber = searchFilters.receiptNumber === "" || 
        (item.receipt_number && item.receipt_number.toLowerCase().includes(searchFilters.receiptNumber.toLowerCase()));
      
      const matchesReturnOrder = searchFilters.returnOrderNumber === "" ||
        (item.return_order_number && item.return_order_number.toLowerCase().includes(searchFilters.returnOrderNumber.toLowerCase()));
      
      const matchesItemDescription = searchFilters.itemDescription === "" ||
        (item.item_description && item.item_description.toLowerCase().includes(searchFilters.itemDescription.toLowerCase()));

      const matchesProductCondition = searchFilters.productCondition === "" ||
        (item.overall_condition && item.overall_condition.toLowerCase().includes(searchFilters.productCondition.toLowerCase()));

      return matchesReceiptNumber && 
             matchesReturnOrder && 
             matchesItemDescription &&
             matchesProductCondition;
    });
  }, [data, searchFilters]);

  const exportToXLSX = (data: ReceiptData[]) => {
    const exportData = data.map(item => ({
      'Receipt Number': item.receipt_number,
      'Return Order Number': item.return_order_number,
      'Customer': item.shipping_info?.shipped_to_person,
      'Item Description': item.item_description,
      'Brand': item.brand_name,
      'Condition': item.overall_condition,
      'Quantity': item.return_qty,
      'Address': item.shipping_info ? 
        `${item.shipping_info.address || ''}, ${item.shipping_info.city || ''}, ${item.shipping_info.state || ''}, ${item.shipping_info.country || ''}` : 
        'N/A',
      'Original Sales Order': item.original_sales_order_number
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inspection Data");
    
    const colWidths = [
      { wch: 15 }, { wch: 18 }, { wch: 20 }, { wch: 30 }, 
      { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 40 }, { wch: 20 }
    ];
    ws['!cols'] = colWidths;

    const excelFile = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelFile], { type: "application/octet-stream" });
    saveAs(blob, "inspection_data.xlsx");
  };

  const exportToPDF = async () => {
    if (selectedItems.size === 0) {
      alert('Please select at least one record to export as PDF');
      return;
    }

    const loadImage = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error('Image load failed'));
        img.src = url;
      });
    };

    const pdfPromises = Array.from(selectedItems).map(async (receiptNumber) => {
      const item = data.find(d => d.receipt_number === receiptNumber);
      if (!item) return;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPos = margin;

      // Header
      pdf.setFontSize(18);
      pdf.setTextColor(30, 64, 175);
      pdf.text('Auditly Inspection Report', margin, yPos);
      yPos += 10;

      // Details
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Receipt #: ${item.receipt_number || 'N/A'}`, margin, yPos);
      yPos += 7;
      pdf.text(`Return Order #: ${item.return_order_number || 'N/A'}`, margin, yPos);
      yPos += 7;
      pdf.text(`Customer: ${item.shipping_info?.shipped_to_person || 'N/A'}`, margin, yPos);
      yPos += 7;
      pdf.text(`Item Description: ${item.item_description || 'N/A'}`, margin, yPos);
      yPos += 7;
      pdf.text(`Brand: ${item.brand_name || 'N/A'}`, margin, yPos);
      yPos += 7;
      pdf.text(`Condition: ${item.overall_condition || 'N/A'}`, margin, yPos);
      yPos += 7;
      pdf.text(`Quantity: ${item.return_qty || 'N/A'}`, margin, yPos);
      yPos += 7;
      pdf.text(`Address: ${item.shipping_info ? 
        `${item.shipping_info.address || ''}, ${item.shipping_info.city || ''}, ${item.shipping_info.state || ''}, ${item.shipping_info.country || ''}` : 
        'N/A'}`, margin, yPos, { maxWidth: pageWidth - margin * 2 });
      yPos += 15;

      // Images in 2x2 grid
      const images = [
        item.images?.difference_images?.front && { url: item.images.difference_images.front, title: 'Front Difference Image' },
        item.images?.difference_images?.back && { url: item.images.difference_images.back, title: 'Back Difference Image' },
        item.images?.base_images?.front && { url: item.images.base_images.front, title: 'Front Base Image' },
        item.images?.base_images?.back && { url: item.images.base_images.back, title: 'Back Base Image' },
      ].filter(Boolean);

      if (images.length > 0) {
        const imageSize = 80;
        const gap = 10;
        const imagesPerRow = 2;

        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          if (!image || !image.url) continue;

          try {
            await loadImage(image.url);

            // Check if we need a new page
            if (yPos + imageSize + 20 > pageHeight - margin) {
              pdf.addPage();
              yPos = margin;
            }

            // Calculate position (2x2 grid)
            const row = Math.floor(i / imagesPerRow);
            const col = i % imagesPerRow;
            const xPos = margin + col * (imageSize + gap);

            // Add title above image
            pdf.setFontSize(12);
            pdf.text(image.title, xPos, yPos);
            yPos += 10;

            // Add image
            pdf.addImage(image.url, 'JPEG', xPos, yPos, imageSize, imageSize);

            // Update yPos after every second image or last image
            if (col === 1 || i === images.length - 1) {
              yPos += imageSize + 15;
            }
          } catch (error) {
            pdf.setFontSize(10);
            pdf.setTextColor(255, 0, 0);
            const xPos = margin + (i % imagesPerRow) * (imageSize + gap);
            pdf.text(`Failed to load ${image.title}`, xPos, yPos + 10);
            pdf.setTextColor(0, 0, 0);
            if (i % imagesPerRow === 1 || i === images.length - 1) {
              yPos += imageSize + 15;
            }
          }
        }
      }

      pdf.save(`Auditly_Report_${item.receipt_number}.pdf`);
    });

    await Promise.all(pdfPromises);
  };

  const clearFilters = () => {
    setSearchFilters({
      receiptNumber: "",
      returnOrderNumber: "",
      itemDescription: "",
      productCondition: "",
    });
  };

  const toggleItemSelection = (receiptNumber: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(receiptNumber)) {
        newSet.delete(receiptNumber);
      } else {
        newSet.add(receiptNumber);
      }
      return newSet;
    });
  };

  const TableHeader = ({ children }: { children: React.ReactNode }) => (
    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50/50">
      {children}
    </th>
  );

  const hasImages = (item: ReceiptData) => {
    return item.images?.difference_images?.front || item.images?.difference_images?.back;
  };

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
            <ClipboardList className="w-10 h-10 text-blue-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700"
          >
            Auditly Inspection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Track and verify inspection details with real-time updates
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl p-6 text-center"
            >
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
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
                      <ClipboardList className="w-6 h-6 text-blue-600" />
                    </motion.div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Inspection Records
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
                      onClick={() => exportToXLSX(filteredData)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                    >
                      Export to XLSX
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      disabled={selectedItems.size === 0}
                    >
                      Export to PDF
                    </button>
                  </div>
                </div>

                <div className="relative mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          <ClipboardList className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search by receipt number..."
                          className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.receiptNumber}
                          onChange={(e) => setSearchFilters({ ...searchFilters, receiptNumber: e.target.value })}
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search by product condition..."
                          className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border-2 border-blue-100 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-300 transition-all duration-300 text-base shadow-sm"
                          value={searchFilters.productCondition}
                          onChange={(e) => setSearchFilters({ ...searchFilters, productCondition: e.target.value })}
                        />
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
                    <div 
                      className="overflow-y-auto"
                      style={{ maxHeight: '400px' }}
                    >
                      <table className="min-w-full divide-y divide-blue-100">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr>
                            <TableHeader>
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedItems(new Set(filteredData.map(item => item.receipt_number)));
                                  } else {
                                    setSelectedItems(new Set());
                                  }
                                }}
                                checked={selectedItems.size === filteredData.length && filteredData.length > 0}
                              />
                            </TableHeader>
                            <TableHeader>Receipt #</TableHeader>
                            <TableHeader>Return Order #</TableHeader>
                            <TableHeader>Customer</TableHeader>
                            <TableHeader>Item Description</TableHeader>
                            <TableHeader>Brand</TableHeader>
                            <TableHeader>Condition</TableHeader>
                            <TableHeader>Qty</TableHeader>
                            <TableHeader>Address</TableHeader>
                            <TableHeader>Images</TableHeader>
                            <TableHeader>Status</TableHeader>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-50">
                          <AnimatePresence>
                            {filteredData.length === 0 ? (
                              <motion.tr
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                              >
                                <td
                                  colSpan={11}
                                  className="px-6 py-12 text-center text-gray-500 bg-gray-50/50"
                                >
                                  <div className="flex flex-col items-center justify-center gap-2">
                                    <ClipboardList className="w-10 h-10 text-gray-400" />
                                    <p className="text-lg font-medium">No matching records found</p>
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
                              filteredData.map((item, index) => (
                                <motion.tr
                                  key={`${item.receipt_number}-${index}`}
                                  variants={itemVariants}
                                  custom={index}
                                  initial="hidden"
                                  animate="visible"
                                  exit="hidden"
                                  className={`hover:bg-blue-50/50 transition-colors duration-200 ${
                                    selectedItems.has(item.receipt_number) ? 'bg-blue-50' : ''
                                  }`}
                                  whileHover={{ scale: 1.002 }}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <input
                                      type="checkbox"
                                      checked={selectedItems.has(item.receipt_number)}
                                      onChange={() => toggleItemSelection(item.receipt_number)}
                                    />
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                    {item.receipt_number || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.return_order_number || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.shipping_info?.shipped_to_person || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.item_description || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.brand_name || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.overall_condition || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {item.return_qty || 'N/A'}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4 text-blue-400" />
                                      {item.shipping_info ? 
                                        `${item.shipping_info.address || ''}, ${item.shipping_info.city || ''}, ${item.shipping_info.state || ''}, ${item.shipping_info.country || ''}` : 
                                        'N/A'}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                      onClick={() => setSelectedItem(item)}
                                      disabled={!hasImages(item)}
                                      className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors text-sm ${
                                        hasImages(item) 
                                          ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      }`}
                                    >
                                      <ImageIcon className="w-4 h-4" />
                                      {hasImages(item) ? 'View' : 'No Images'}
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700">
                                      Inspection Complete
                                    </span>
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

      {selectedItem && selectedItem.images && (
        <ImageViewerModal 
          images={selectedItem.images} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
};

export default AuditlyInspection;
