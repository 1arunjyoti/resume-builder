"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Move, Check, X } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
}

interface CropBox {
  x: number;
  y: number;
  size: number;
}

export function ImageCropper({
  imageSrc,
  onCrop,
  onCancel,
}: ImageCropperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [displayDimensions, setDisplayDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0, y: 0, size: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeCorner, setResizeCorner] = useState<string | null>(null);

  const MIN_CROP_SIZE = 50;
  const OUTPUT_SIZE = 400;

  // Calculate display dimensions to fit container
  const calculateDisplayDimensions = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth - 48; // padding
    const containerHeight = 400; // max height
    const imgWidth = imageRef.current.naturalWidth;
    const imgHeight = imageRef.current.naturalHeight;

    const scale = Math.min(
      containerWidth / imgWidth,
      containerHeight / imgHeight,
      1,
    );

    const displayWidth = imgWidth * scale;
    const displayHeight = imgHeight * scale;

    setImageDimensions({ width: imgWidth, height: imgHeight });
    setDisplayDimensions({ width: displayWidth, height: displayHeight });

    // Initialize crop box to center square
    const initialSize = Math.min(displayWidth, displayHeight) * 0.8;
    setCropBox({
      x: (displayWidth - initialSize) / 2,
      y: (displayHeight - initialSize) / 2,
      size: initialSize,
    });
  }, []);

  useEffect(() => {
    if (imageLoaded) {
      calculateDisplayDimensions();
    }
  }, [imageLoaded, calculateDisplayDimensions]);

  // Constrain crop box to image bounds
  const constrainCropBox = useCallback(
    (box: CropBox): CropBox => {
      const maxX = displayDimensions.width - box.size;
      const maxY = displayDimensions.height - box.size;

      return {
        x: Math.max(0, Math.min(box.x, maxX)),
        y: Math.max(0, Math.min(box.y, maxY)),
        size: Math.min(
          box.size,
          displayDimensions.width,
          displayDimensions.height,
        ),
      };
    },
    [displayDimensions],
  );

  // Handle mouse/touch events for dragging
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setIsDragging(true);
    setDragStart({
      x: clientX - cropBox.x,
      y: clientY - cropBox.y,
    });
  };

  const handleResizeStart = (
    e: React.MouseEvent | React.TouchEvent,
    corner: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeCorner(corner);

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    setDragStart({ x: clientX, y: clientY });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging && !isResizing) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const newX = clientX - dragStart.x;
        const newY = clientY - dragStart.y;

        setCropBox((prev) =>
          constrainCropBox({
            ...prev,
            x: newX,
            y: newY,
          }),
        );
      } else if (isResizing && resizeCorner) {
        const deltaX = clientX - dragStart.x;
        const deltaY = clientY - dragStart.y;

        // Use the larger delta for uniform scaling
        const delta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
        const sign =
          resizeCorner.includes("bottom") || resizeCorner.includes("right")
            ? deltaX > 0 || deltaY > 0
              ? 1
              : -1
            : deltaX < 0 || deltaY < 0
              ? 1
              : -1;

        setCropBox((prev) => {
          const newSize = Math.max(MIN_CROP_SIZE, prev.size + sign * delta);
          const maxSize = Math.min(
            displayDimensions.width -
              (resizeCorner.includes("right") ? prev.x : 0),
            displayDimensions.height -
              (resizeCorner.includes("bottom") ? prev.y : 0),
            displayDimensions.width,
            displayDimensions.height,
          );

          const clampedSize = Math.min(newSize, maxSize);

          // Adjust position for top-left resize
          let newX = prev.x;
          let newY = prev.y;

          if (resizeCorner.includes("left")) {
            newX = prev.x + prev.size - clampedSize;
          }
          if (resizeCorner.includes("top")) {
            newY = prev.y + prev.size - clampedSize;
          }

          return constrainCropBox({
            x: newX,
            y: newY,
            size: clampedSize,
          });
        });

        setDragStart({ x: clientX, y: clientY });
      }
    },
    [
      isDragging,
      isResizing,
      dragStart,
      resizeCorner,
      constrainCropBox,
      displayDimensions,
    ],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeCorner(null);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleMouseMove);
    document.addEventListener("touchend", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleMouseMove);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Update preview canvas when crop box changes
  useEffect(() => {
    if (!imageLoaded || !imageRef.current || !previewCanvasRef.current) return;

    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scale = imageDimensions.width / displayDimensions.width;
    ctx.clearRect(0, 0, 80, 80);
    ctx.drawImage(
      imageRef.current,
      cropBox.x * scale,
      cropBox.y * scale,
      cropBox.size * scale,
      cropBox.size * scale,
      0,
      0,
      80,
      80,
    );
  }, [imageLoaded, cropBox, imageDimensions, displayDimensions]);

  // Perform crop and resize
  const handleCrop = async () => {
    if (!imageRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate scale between display and actual image
    const scale = imageDimensions.width / displayDimensions.width;

    // Calculate crop region in actual image coordinates
    const sourceX = cropBox.x * scale;
    const sourceY = cropBox.y * scale;
    const sourceSize = cropBox.size * scale;

    // Draw cropped and resized image
    ctx.drawImage(
      imageRef.current,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE,
    );

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCrop(blob);
        }
      },
      "image/png",
      1,
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <h3 className="font-semibold text-lg">Crop Your Photo</h3>
        <p className="text-sm text-muted-foreground">
          Drag to position, use corners to resize
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative bg-muted rounded-lg p-6 flex items-center justify-center overflow-hidden"
        style={{ minHeight: 300 }}
      >
        {/* Image Container */}
        <div
          className="relative"
          style={{
            width: displayDimensions.width,
            height: displayDimensions.height,
          }}
        >
          {/* Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop preview"
            className="block select-none"
            style={{
              width: displayDimensions.width || "auto",
              height: displayDimensions.height || "auto",
              maxWidth: "100%",
            }}
            onLoad={() => setImageLoaded(true)}
            draggable={false}
          />

          {/* Dark overlay with crop cutout */}
          {imageLoaded && (
            <>
              {/* Top overlay */}
              <div
                className="absolute bg-black/50 pointer-events-none"
                style={{
                  top: 0,
                  left: 0,
                  right: 0,
                  height: cropBox.y,
                }}
              />
              {/* Bottom overlay */}
              <div
                className="absolute bg-black/50 pointer-events-none"
                style={{
                  top: cropBox.y + cropBox.size,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
              {/* Left overlay */}
              <div
                className="absolute bg-black/50 pointer-events-none"
                style={{
                  top: cropBox.y,
                  left: 0,
                  width: cropBox.x,
                  height: cropBox.size,
                }}
              />
              {/* Right overlay */}
              <div
                className="absolute bg-black/50 pointer-events-none"
                style={{
                  top: cropBox.y,
                  left: cropBox.x + cropBox.size,
                  right: 0,
                  height: cropBox.size,
                }}
              />

              {/* Crop box border */}
              <div
                className="absolute border-2 border-white cursor-move"
                style={{
                  left: cropBox.x,
                  top: cropBox.y,
                  width: cropBox.size,
                  height: cropBox.size,
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                  <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
                  <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                  <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
                </div>

                {/* Move icon in center */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 rounded-full p-2">
                    <Move className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Corner resize handles */}
                {["top-left", "top-right", "bottom-left", "bottom-right"].map(
                  (corner) => (
                    <div
                      key={corner}
                      className="absolute w-4 h-4 bg-white border-2 border-primary rounded-sm cursor-nwse-resize"
                      style={{
                        [corner.includes("top") ? "top" : "bottom"]: -8,
                        [corner.includes("left") ? "left" : "right"]: -8,
                        cursor:
                          corner === "top-left" || corner === "bottom-right"
                            ? "nwse-resize"
                            : "nesw-resize",
                      }}
                      onMouseDown={(e) => handleResizeStart(e, corner)}
                      onTouchStart={(e) => handleResizeStart(e, corner)}
                    />
                  ),
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">
            Preview (400×400)
          </p>
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-muted bg-muted mx-auto">
            <canvas
              ref={previewCanvasRef}
              width={80}
              height={80}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4" />
          Cancel
        </Button>
        <Button onClick={handleCrop}>
          <Check className="w-4 h-4" />
          Apply Crop
        </Button>
      </div>
    </div>
  );
}
