import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { X } from "lucide-react";

const BarcodeScanner = ({ isOpen, onClose, onScan }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false,
    );

    const onScanSuccess = (decodedText) => {
      // Play beep
      const audio = new Audio("https://www.soundjay.com/buttons/beep-01a.mp3");
      audio.play().catch((e) => console.log("Audio play failed", e));

      onScan(decodedText);
      scanner.clear();
      onClose();
    };

    // REMOVED 'error' parameter here 👇
    const onScanFailure = () => {
      // We just ignore failures because the scanner fails
      // every frame it doesn't see a code.
    };

    scanner.render(onScanSuccess, onScanFailure);
    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear html5-qrcode scanner. ", error);
        });
      }
    };
  }, [isOpen, onScan, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden relative">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Scan Barcode / QR</h3>
          <button
            onClick={onClose}
            className="p-1 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 bg-black">
          <div
            id="reader"
            className="w-full bg-slate-100 rounded-lg overflow-hidden text-center text-white min-h-[300px]"
          ></div>
          <p className="text-center text-white/70 text-sm mt-4">
            Point camera at a barcode or QR code
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
