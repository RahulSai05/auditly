import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../../store/slices/itemSlice';
import axios from 'axios';
import { BrowserMultiFormatReader, NotFoundException, Result } from '@zxing/library';

const Scan = () => {
    const [productData, setProductData] = useState<any>(null);
    const [isFetched, setIsFetched] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [scannedItems, setScannedItems] = useState<string[]>([]); // Prevent duplicate scans
    const videoRef = useRef<HTMLVideoElement>(null);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const dispatch = useDispatch();
    const router = useNavigate();
    const scanningActive = useRef(false); // Prevent repeated scanning

    // Cleanup scanning on unmount
    useEffect(() => {
        return () => stopScanning();
    }, []);

    // Start scanning only when isScanning changes to true
    useEffect(() => {
        if (isScanning) {
            startCameraAndScanning();
        }
    }, [isScanning]);

    // Stop scanning and clean up resources
    const stopScanning = useCallback(() => {
        scanningActive.current = false; // Stop further scanning attempts
        if (codeReader.current) {
            codeReader.current.reset();
            codeReader.current.stopContinuousDecode();
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
    }, []);

    // Fetch product details from API
    const fetchDetails = useCallback((decodedText: string) => {
        if (scannedItems.includes(decodedText)) return; // Prevent duplicate scans
        setScannedItems(prev => [...prev, decodedText]); // Store scanned item

        setIsScanning(false);
        axios
            .get(`http://localhost:8000/item_order_instance`, { params: { identifier: decodedText } })
            .then(response => {
                if (response.status === 200) {
                    setProductData(response.data);
                    setIsFetched(true);
                    dispatch(addItem(response.data));
                } else {
                    setErrorMessage('Failed to fetch details. Please try scanning again.');
                    setIsFetched(true); // Set isFetched to true even if no data is found
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                setErrorMessage('Failed to fetch details. Please try manual entry.');
                setIsFetched(true); // Set isFetched to true even if the API call fails
            });
    }, [dispatch, scannedItems]);

    // Start the camera and barcode scanning
    const startCameraAndScanning = useCallback(() => {
        if (scanningActive.current) return; // Prevent duplicate camera start
        scanningActive.current = true;

        setErrorMessage('');

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();

                    // Start barcode scanning
                    codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result: Result | null, err) => {
                        if (result) {
                            console.log('Barcode detected:', result.getText());
                            fetchDetails(result.getText());
                            stopScanning(); // Stop scanning after detection
                        }
                        if (err) {
                            if (err instanceof NotFoundException) {
                                console.log('No barcode detected. Keep trying...');
                            } else {
                                console.error('Error:', err);
                                setErrorMessage('Scanning error. Please adjust the barcode and try again.');
                                stopScanning();
                            }
                        }
                    }).catch(e => {
                        console.error('Error starting the scanner:', e);
                        setErrorMessage('Error starting the scanner. Please check your camera permissions.');
                        stopScanning();
                    });
                }
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
                setErrorMessage('Error accessing camera. Please check your camera permissions.');
                stopScanning();
            });
    }, [fetchDetails, stopScanning]);

    // Navigate to the next page if product data is available
    const handleNext = () => {
        if (productData) {
            router('/return/details');
        }
    };

    // Navigate to the manual entry page
    const handleManualEntry = () => {
        router('/option/manual'); // Redirect to the manual entry page
    };

    return (
        <div className="flex flex-col items-center p-6 pt-[10vh] min-h-screen bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Scan Serial Number or Return Order Number</h2>
            {!isScanning && (
                <button onClick={() => setIsScanning(true)} className="mt-4 px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
                    Start Scanning
                </button>
            )}
            {isScanning && (
                <video
                    ref={videoRef}
                    style={{ width: "500px", height: "320px", border: "1px solid black" }}
                    autoPlay
                    muted
                    playsInline
                />
            )}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {isFetched && productData ? (
                <>
                    <div className="mt-8 p-6 bg-white shadow-lg rounded-lg max-w-[900px] w-full">
                        <div className="grid grid-cols-2 gap-8">
                            {/* Card 1: General Information */}
                            <div className="p-6 bg-gray-100 shadow rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-gray-700 text-center">
                                    General Information
                                </h3>
                                <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
                                    <span>Original Sales Order</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.original_sales_order_number}
                                    </span>
                                    <span>Order Line</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.original_sales_order_line}
                                    </span>
                                    <span>Ordered Quantity</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.ordered_qty}
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: Return Information */}
                            <div className="p-6 bg-gray-100 shadow rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-gray-700 text-center">
                                    Return Information
                                </h3>
                                <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
                                    <span>Return Order Number</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.return_order_number}
                                    </span>
                                    <span>Order Line</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.return_order_line}
                                    </span>
                                    <span>Ordered Quantity</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.return_qty}
                                    </span>
                                </div>
                            </div>

                            {/* Card 3: Shipping Information */}
                            <div className="p-6 bg-gray-100 shadow rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-gray-700 text-center">
                                    Shipping Information
                                </h3>
                                <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
                                    <span>Serial Number</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.serial_number}
                                    </span>
                                    <span>Vendor Item Number</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.vendor_item_number}
                                    </span>
                                    <span>Shipped To</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.shipped_to_person}
                                    </span>
                                    <span>Address</span>
                                    <span className="font-medium text-gray-800">
                                        : {`${productData.shipped_to_address.street_number}, ${productData.shipped_to_address.city}, ${productData.shipped_to_address.state}, ${productData.shipped_to_address.country}`}
                                    </span>
                                </div>
                            </div>

                            {/* Card 4: Dimensions */}
                            <div className="p-6 bg-gray-100 shadow rounded-lg">
                                <h3 className="font-semibold text-lg mb-4 text-gray-700 text-center">
                                    Dimensions
                                </h3>
                                <div className="grid grid-cols-[200px_1fr] gap-y-2 text-sm">
                                    <span>Depth</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.dimensions.depth}
                                    </span>
                                    <span>Length</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.dimensions.length}
                                    </span>
                                    <span>Breadth</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.dimensions.breadth}
                                    </span>
                                    <span>Weight</span>
                                    <span className="font-medium text-gray-800">
                                        : {productData.dimensions.weight}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-6 max-w-[900px] w-full">
                        <button
                            onClick={() => router('/')}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setIsScanning(true)}
                            disabled={isScanning || isFetched} // Disabled if already scanning or data fetched
                            className={`px-4 py-2 text-white rounded-lg ${isScanning || isFetched ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            Scan Again
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={!isFetched}
                            className={`px-4 py-2 text-white rounded-lg ${isFetched ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                isFetched && (
                    <div className="mt-8 p-6 bg-white shadow-lg rounded-lg max-w-[900px] w-full text-center">
                        <p className="text-gray-800 mb-4">
                            No matching records found. Please try manual entry.
                        </p>
                        <button
                            onClick={handleManualEntry}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Go to Manual Entry
                        </button>
                    </div>
                )
            )}
        </div>
    );
};

export default Scan;