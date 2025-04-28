// import { useState, useRef, useEffect, useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { addItem } from "../../store/slices/itemSlice";
// import { ChevronLeft, ChevronRight, ScanLine } from "lucide-react";
// import axios from "axios";
// import {
//   BrowserMultiFormatReader,
//   NotFoundException,
//   Result,
// } from "@zxing/library";

// const Scan = () => {
//   const [productData, setProductData] = useState<any>(null);
//   const [isFetched, setIsFetched] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [scannedItems, setScannedItems] = useState<string[]>([]);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const codeReader = useRef(new BrowserMultiFormatReader());
//   const dispatch = useDispatch();
//   const router = useNavigate();
//   const scanningActive = useRef(false);

//   useEffect(() => {
//     return () => stopScanning();
//   }, []);

//   useEffect(() => {
//     if (isScanning) {
//       startCameraAndScanning();
//     }
//   }, [isScanning]);

//   const stopScanning = useCallback(() => {
//     scanningActive.current = false;
//     if (codeReader.current) {
//       codeReader.current.reset();
//       codeReader.current.stopContinuousDecode();
//     }
//     if (videoRef.current && videoRef.current.srcObject) {
//       const stream = videoRef.current.srcObject as MediaStream;
//       stream.getTracks().forEach((track) => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setIsScanning(false);
//   }, []);

//   const fetchDetails = useCallback(
//     (decodedText: string) => {
//       if (scannedItems.includes(decodedText)) return;
//       setScannedItems((prev) => [...prev, decodedText]);

//       setIsScanning(false);
//       axios
//         .get(`https://auditlyai.com/api/item_order_instance`, {
//           params: { identifier: decodedText },
//         })
//         .then((response) => {
//           if (response.status === 200) {
//             setProductData(response.data);
//             setIsFetched(true);
//             dispatch(addItem(response.data));
//           } else {
//             setErrorMessage(
//               "Failed to fetch details. Please try scanning again."
//             );
//             setIsFetched(true);
//           }
//         })
//         .catch((error) => {
//           console.error("Fetch error:", error);
//           setErrorMessage("Failed to fetch details. Please try manual entry.");
//           setIsFetched(true);
//         });
//     },
//     [dispatch, scannedItems]
//   );

//   const startCameraAndScanning = useCallback(() => {
//     if (scanningActive.current) return;
//     scanningActive.current = true;

//     setErrorMessage("");

//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then((stream) => {
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.play();

//           codeReader.current
//             .decodeFromVideoDevice(
//               null,
//               videoRef.current,
//               (result: Result | null, err) => {
//                 if (result) {
//                   console.log("Barcode detected:", result.getText());
//                   fetchDetails(result.getText());
//                   stopScanning();
//                 }
//                 if (err) {
//                   if (err instanceof NotFoundException) {
//                     console.log("No barcode detected. Keep trying...");
//                   } else {
//                     console.error("Error:", err);
//                     setErrorMessage(
//                       "Scanning error. Please adjust the barcode and try again."
//                     );
//                     stopScanning();
//                   }
//                 }
//               }
//             )
//             .catch((e) => {
//               console.error("Error starting the scanner:", e);
//               setErrorMessage(
//                 "Error starting the scanner. Please check your camera permissions."
//               );
//               stopScanning();
//             });
//         }
//       })
//       .catch((err) => {
//         console.error("Error accessing camera:", err);
//         setErrorMessage(
//           "Error accessing camera. Please check your camera permissions."
//         );
//         stopScanning();
//       });
//   }, [fetchDetails, stopScanning]);

//   const handleNext = () => {
//     if (productData) {
//       router("/return/details");
//     }
//   };

//   const handleManualEntry = () => {
//     router("/option/manual");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center mb-8">
//           <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-2 inline-block">
//             Scanner
//           </span>
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">
//             Scan Serial Number or Return Order Number
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Position the barcode in front of your camera for automatic scanning
//           </p>
//         </div>

//         <div className="max-w-3xl mx-auto">
//           {!isScanning && !isFetched && (
//             <div className="text-center">
//               <button
//                 onClick={() => setIsScanning(true)}
//                 className="group inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
//               >
//                 <ScanLine className="w-5 h-5" />
//                 Start Scanning
//                 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//               </button>
//             </div>
//           )}

//           {isScanning && (
//             <div className="relative">
//               <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
//                 <video
//                   ref={videoRef}
//                   className="w-full h-full object-cover"
//                   autoPlay
//                   muted
//                   playsInline
//                 />
//               </div>
//               <div className="absolute inset-0 border-2 border-blue-200 rounded-2xl animate-pulse pointer-events-none" />
//             </div>
//           )}

//           {errorMessage && (
//             <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
//               <p className="text-red-600 text-center">{errorMessage}</p>
//             </div>
//           )}

//           {isFetched && productData && (
//             <div className="mt-8 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* General Information */}
//                 <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
//                     General Information
//                   </h3>
//                   <dl className="space-y-2">
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Original Sales Order</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.original_sales_order_number}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Order Line</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.original_sales_order_line}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Ordered Quantity</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.ordered_qty}
//                       </dd>
//                     </div>
//                   </dl>
//                 </div>

//                 {/* Return Information */}
//                 <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
//                     Return Information
//                   </h3>
//                   <dl className="space-y-2">
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Return Order Number</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.return_order_number}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Order Line</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.return_order_line}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Return Quantity</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.return_qty}
//                       </dd>
//                     </div>
//                   </dl>
//                 </div>

//                 {/* Shipping Information */}
//                 <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
//                     Shipping Information
//                   </h3>
//                   <dl className="space-y-2">
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Serial Number</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.serial_number}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Vendor Item Number</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.vendor_item_number}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Shipped To</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.shipped_to_person}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Address</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {`${productData.shipped_to_address.street_number}, ${productData.shipped_to_address.city}, ${productData.shipped_to_address.state}, ${productData.shipped_to_address.country}`}
//                       </dd>
//                     </div>
//                   </dl>
//                 </div>

//                 {/* Dimensions */}
//                 <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
//                     Dimensions
//                   </h3>
//                   <dl className="space-y-2">
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Depth</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.dimensions.depth}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Length</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.dimensions.length}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Breadth</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.dimensions.breadth}
//                       </dd>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2">
//                       <dt className="text-gray-600">Weight</dt>
//                       <dd className="text-gray-900 font-medium">
//                         {productData.dimensions.weight}
//                       </dd>
//                     </div>
//                   </dl>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-8">
//                 <button
//                   onClick={() => router("/")}
//                   className="group flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
//                 >
//                   <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
//                   Back
//                 </button>
//                 <button
//                   onClick={() => setIsScanning(true)}
//                   disabled={isScanning}
//                   className={`
//                                         group flex items-center gap-2 px-6 py-2 rounded-lg
//                                         font-medium transition-all duration-200
//                                         ${
//                                           isScanning
//                                             ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                             : "bg-blue-600 text-white hover:bg-blue-700"
//                                         }
//                                     `}
//                 >
//                   <ScanLine className="w-4 h-4" />
//                   Scan Again
//                 </button>
//                 <button
//                   onClick={handleNext}
//                   className="group flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
//                 >
//                   Continue
//                   <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//                 </button>
//               </div>
//             </div>
//           )}


//           {isFetched && !productData && (
//   <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg text-center">
//     <p className="text-gray-800 mb-6">
//       No matching records found. Please try manual entry.
//     </p>
//     <div className="flex justify-center"> {/* Added this container */}
//       <button
//         onClick={handleManualEntry}
//         className="group flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
//       >
//         Go to Manual Entry
//         <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//       </button>
//     </div>
//   </div>
// )}
// {/*           {isFetched && !productData && (
//             <div className="mt-8 bg-white p-8 rounded-2xl shadow-lg text-center">
//               <p className="text-gray-800 mb-6">
//                 No matching records found. Please try manual entry.
//               </p>
//               <button
//                 onClick={handleManualEntry}
//                 className="group flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
//               >
//                 Go to Manual Entry
//                 <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//               </button>
//             </div>
//           )} */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Scan;



import { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem } from "../../store/slices/itemSlice";
import { ChevronLeft, ChevronRight, ScanLine, Package, Package2, Truck, Ruler, FileText } from "lucide-react";
import axios from "axios";
import {
  BrowserMultiFormatReader,
  NotFoundException,
  Result,
} from "@zxing/library";
import { motion, AnimatePresence } from "framer-motion";

const Scan = () => {
  const [productData, setProductData] = useState<any>(null);
  const [isFetched, setIsFetched] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());
  const dispatch = useDispatch();
  const router = useNavigate();
  const scanningActive = useRef(false);

  useEffect(() => {
    return () => stopScanning();
  }, []);

  useEffect(() => {
    if (isScanning) {
      startCameraAndScanning();
    }
  }, [isScanning]);

  const stopScanning = useCallback(() => {
    scanningActive.current = false;
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current.stopContinuousDecode();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  const fetchDetails = useCallback(
    (decodedText: string) => {
      if (scannedItems.includes(decodedText)) return;
      setScannedItems((prev) => [...prev, decodedText]);

      setIsScanning(false);
      axios
        .get(`https://auditlyai.com/api/item_order_instance`, {
          params: { identifier: decodedText },
        })
        .then((response) => {
          if (response.status === 200) {
            setProductData(response.data);
            setIsFetched(true);
            localStorage.setItem('lastItemId', response.data.item_id.toString());
            localStorage.setItem('lastCustomerId', response.data.customer_id.toString());
            dispatch(addItem(response.data));
          } else {
            setErrorMessage(
              "Failed to fetch details. Please try scanning again."
            );
            setIsFetched(true);
          }
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          setErrorMessage("Failed to fetch details. Please try manual entry.");
          setIsFetched(true);
        });
    },
    [dispatch, scannedItems]
  );

  const startCameraAndScanning = useCallback(() => {
    if (scanningActive.current) return;
    scanningActive.current = true;

    setErrorMessage("");

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();

          codeReader.current
            .decodeFromVideoDevice(
              null,
              videoRef.current,
              (result: Result | null, err) => {
                if (result) {
                  console.log("Barcode detected:", result.getText());
                  fetchDetails(result.getText());
                  stopScanning();
                }
                if (err) {
                  if (err instanceof NotFoundException) {
                    console.log("No barcode detected. Keep trying...");
                  } else {
                    console.error("Error:", err);
                    setErrorMessage(
                      "Scanning error. Please adjust the barcode and try again."
                    );
                    stopScanning();
                  }
                }
              }
            )
            .catch((e) => {
              console.error("Error starting the scanner:", e);
              setErrorMessage(
                "Error starting the scanner. Please check your camera permissions."
              );
              stopScanning();
            });
        }
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setErrorMessage(
          "Error accessing camera. Please check your camera permissions."
        );
        stopScanning();
      });
  }, [fetchDetails, stopScanning]);

  const handleNext = () => {
    if (productData) {
      router("/return/details");
    }
  };

  const handleManualEntry = () => {
    router("/option/manual");
  };

  // Format address helper function
  const formatAddress = (address: any) => {
    return `${address.street_number}, ${address.city}, ${address.state}, ${address.country}`;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="text-center mb-12">
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Product Return Portal
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Scan your Serial Number or Return Order Number to begin the return process
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {!isScanning && !isFetched && (
          <motion.div 
            variants={itemVariants}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsScanning(true)}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              <ScanLine className="w-5 h-5" />
              Start Scanning
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>
        )}

        {isScanning && (
          <motion.div 
            variants={itemVariants}
            className="relative"
          >
            <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            </div>
            <div className="absolute inset-0 border-4 border-blue-400 rounded-2xl animate-pulse pointer-events-none" />
          </motion.div>
        )}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mt-4 p-4 bg-red-50 rounded-xl border border-red-200 max-w-3xl mx-auto"
          >
            <span className="text-red-600">{errorMessage}</span>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isFetched && productData ? (
            <motion.div
              key="results"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={containerVariants}
              className="mt-8"
            >
              {/* Information Grid */}
              <motion.div 
                variants={containerVariants}
                className="grid md:grid-cols-2 gap-8 mb-8"
              >
                {/* Sales Order Info */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-4">
                    <Package2 className="w-8 h-8 text-blue-600 mr-2" />
                    <h3 className="font-bold text-xl text-gray-800">Sales Order Info</h3>
                  </div>
                  <div className="space-y-4">
                    <InfoRow label="Sales Order Number" value={productData.original_sales_order_number} />
                    <InfoRow label="Order Line" value={productData.original_sales_order_line} />
                    <InfoRow label="Order Quantity" value={productData.ordered_qty} />
                    <InfoRow label="Shipped to" value={productData.shipped_to_person} />
                    <InfoRow label="Customer Address" value={formatAddress(productData.shipped_to_address)} />
                    <InfoRow label="Billed to" value={productData.shipped_to_person} />
                    <InfoRow label="Billing Address" value={formatAddress(productData.shipped_to_address)} />
                  </div>
                </motion.div>

                {/* Return Order Information */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-green-600 mr-2" />
                    <h3 className="font-bold text-xl text-gray-800">Return Order Information</h3>
                  </div>
                  <div className="space-y-4">
                    <InfoRow label="Return Order Number" value={`#${productData.return_order_number}`} />
                    <InfoRow label="Order Line" value={productData.return_order_line} />
                    <InfoRow label="Return Quantity" value={productData.return_qty} />
                    <InfoRow label="Return Pick up Location" value={formatAddress(productData.shipped_to_address)} />
                  </div>
                </motion.div>

                {/* Product Information */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-4">
                    <Truck className="w-8 h-8 text-purple-600 mr-2" />
                    <h3 className="font-bold text-xl text-gray-800">Product Information</h3>
                  </div>
                  <div className="space-y-4">
                    <InfoRow label="SKU Number" value={productData.item_details.item_number} />
                    <InfoRow label="Item Description" value={productData.item_details.item_description} />
                    <InfoRow label="Vendor Item Number" value={productData.vendor_item_number} />
                    <InfoRow label="SSCC Number" value={productData.sscc_number} />
                    <InfoRow label="Tag Number" value={productData.tag_number} />
                  </div>
                </motion.div>

                {/* Product Dimensions */}
                <motion.div 
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-center mb-4">
                    <Ruler className="w-8 h-8 text-orange-600 mr-2" />
                    <h3 className="font-bold text-xl text-gray-800">Product Dimensions</h3>
                  </div>
                  <div className="space-y-4">
                    <InfoRow label="Depth" value={`${productData.dimensions.depth} in`} />
                    <InfoRow label="Length" value={`${productData.dimensions.length} in`} />
                    <InfoRow label="Breadth" value={`${productData.dimensions.breadth} in`} />
                    <InfoRow label="Weight" value={`${productData.dimensions.weight} lbs`} />
                    <InfoRow label="Volume" value={`${productData.dimensions.volume} cu in`} />
                    <InfoRow label="Size" value={productData.dimensions.size} />
                  </div>
                </motion.div>
              </motion.div>

              {/* Navigation Buttons */}
              <motion.div 
                variants={itemVariants}
                className="flex justify-end gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router('/')}
                  className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsScanning(true)}
                  className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
                >
                  <ScanLine className="w-5 h-5" />
                  Scan Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
                >
                  Continue
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </motion.div>
            </motion.div>
          ) : isFetched && !productData && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-2xl mx-auto border border-gray-100 mt-8"
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products matching your scan. Please try scanning again or use manual entry.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsScanning(true)}
                  className="group flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
                >
                  <ScanLine className="w-5 h-5" />
                  Scan Again
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleManualEntry}
                  className="group flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  Manual Entry
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Helper component for consistent info row styling
const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-800 font-semibold text-right max-w-[60%] break-words">{value}</span>
  </div>
);

export default Scan;
