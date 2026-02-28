import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, Upload } from "lucide-react";
import { Button } from "@/components/Button";

interface CropImageCardProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (image: string) => void;
}

export const CropImageCard: React.FC<CropImageCardProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => {
        track.stop();
        track.enabled = false;
      });
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleConfirm = (image: string) => {
    stopCamera();
    onConfirm(image);
  };

  // Initialize Camera
  const startCamera = useCallback(async () => {
    setIsCameraActive(true);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please upload an image instead.");
    }
  }, []);

  // Capture Photo
  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    stopCamera();
    setCapturedImage(dataUrl);
    setIsCameraActive(false);
  };

  // Stop camera immediately when user opens the file picker
  const handleUploadFromGallery = () => {
    stopCamera();
    setIsCameraActive(false);
    fileInputRef.current?.click();
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (isOpen && isCameraActive) {
      startCamera();
    }

    // Cleanup: stop camera when component unmounts or isOpen changes
    return () => stopCamera();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    // <section className="relative h-full w-full overflow-hidden bg-black text-white">
    <section className="size-full">
      {/* Header Overlay */}
      <div className="flex h-full flex-col justify-between overflow-y-auto pb-10">
        <header className="mb-10 flex items-start gap-3.5 pt-7 pr-20 pl-6">
          <button
            onClick={handleClose}
            className="grid size-fit place-items-center rounded-full bg-[#E8E8E8] p-1"
          >
            <ChevronLeft size={24} className="text-[#434449]" />
          </button>
          <div>
            <h5 className="font-neue text-xl font-bold text-[#130B30]">
              Crop Image
            </h5>
            <h6 className="text-[#423C59]">
              Upload an image of the affected crop
            </h6>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="relative h-full w-11/12 mx-auto rounded-xl overflow-hidden">
          {isCameraActive ? (
            /* CAMERA VIEW */
            <div className="relative h-full w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />

              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                <h2 className="mb-8 text-xl font-semibold">
                  Take a picture of the affected crop
                </h2>
                <div className="relative size-72 rounded-2xl border-2 border-yellow-400">
                  <div className="absolute -top-1 -left-1 size-8 rounded-tl-lg border-t-4 border-l-4 border-yellow-500" />
                  <div className="absolute -top-1 -right-1 size-8 rounded-tr-lg border-t-4 border-r-4 border-yellow-500" />
                  <div className="absolute -bottom-1 -left-1 size-8 rounded-bl-lg border-b-4 border-l-4 border-yellow-500" />
                  <div className="absolute -right-1 -bottom-1 size-8 rounded-br-lg border-r-4 border-b-4 border-yellow-500" />
                </div>

                <button
                  onClick={handleUploadFromGallery}
                  className="mt-12 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm"
                >
                  <Upload size={20} />
                  <span>Upload from gallery</span>
                </button>
              </div>

              {/* Shutter Button */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <button
                  onClick={capturePhoto}
                  className="size-20 rounded-full border-4 border-white p-1"
                >
                  <div className="size-full rounded-full bg-white shadow-lg active:bg-gray-200" />
                </button>
              </div>
            </div>
          ) : (
            /* PREVIEW VIEW */
            <div className="relative h-full w-full">
              <img
                src={capturedImage!}
                className="h-full w-full object-cover"
                alt="Crop Preview"
              />

              {/* Action Card */}
              <div className="absolute bottom-0 w-full rounded-xl p-10 pb-12 text-[#130B30]">
                <div className="space-y-4">
                  <Button
                    onClick={() => handleConfirm(capturedImage!)}
                    variant="primary"
                    className="w-full text-lg"
                  >
                    Upload image
                  </Button>

                  <Button
                    onClick={startCamera}
                    variant="secondary"
                    className="w-full"
                  >
                    Retake image
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>
    </section>
  );
};
