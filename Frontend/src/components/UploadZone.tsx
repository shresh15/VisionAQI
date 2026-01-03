import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function UploadZone({ onFileSelect, selectedFile, onClear }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`
              relative group cursor-pointer
              border-3 border-dashed rounded-3xl p-12
              transition-all duration-300 ease-out
              flex flex-col items-center justify-center text-center
              bg-white/50 backdrop-blur-sm
              ${isDragging 
                ? "border-primary bg-primary/5 scale-[1.02]" 
                : "border-border hover:border-primary/50 hover:bg-white/80"
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              accept="image/*"
              onChange={handleChange}
            />
            
            <div className={`
              p-6 rounded-full bg-primary/5 mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300
            `}>
              <Upload className="w-10 h-10 text-primary" />
            </div>
            
            <h3 className="text-xl font-bold font-display text-foreground mb-2">
              Upload Sky Image
            </h3>
            <p className="text-muted-foreground max-w-sm">
              Drag & drop your photo here, or click to browse. 
              <br />
              <span className="text-xs mt-2 block">Supports JPG, PNG (Max 5MB)</span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative rounded-3xl overflow-hidden shadow-xl group border-4 border-white"
          >
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="w-full h-64 md:h-96 object-cover"
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button
                onClick={onClear}
                className="bg-white/20 backdrop-blur-md border border-white/50 text-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-red-500 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Remove Image
              </button>
            </div>
            
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md rounded-xl p-3 flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{selectedFile.name}</p>
                <p className="text-white/70 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
