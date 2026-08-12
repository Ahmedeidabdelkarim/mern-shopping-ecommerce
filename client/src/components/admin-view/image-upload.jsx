import { UploadCloudIcon, XIcon, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";

function ProductImageUpload({
  imageFile,
  setImageFile,
  imageLoadingState,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const [previewUrl, setPreviewUrl] = useState("");

  // Create a local preview immediately after selecting an image.
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setImageFile(selectedFile);
      setUploadedImageUrl("");
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      setImageFile(droppedFile);
      setUploadedImageUrl("");
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
  }

  async function uploadImageToCloudinary() {
    if (!imageFile) return;
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/admin/products/upload-image`,
      data
    );
    console.log(response, "response");

    try {
      setImageLoadingState(true);

      const data = new FormData();
      data.append("my_file", imageFile);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/products/upload-image`,
        data,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageLoadingState(false);
    }
  }

  return (
    <div
      className={`w-full mt-4 ${
        isCustomStyling ? "" : "max-w-md mx-auto"
      }`}
    >
      <Label className="text-lg font-semibold mb-2 block">
        Upload Image
      </Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          onChange={handleImageFileChange}
          disabled={isEditMode || imageLoadingState}
          accept="image/*"
        />

        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <>
            {/* Show the selected image immediately using a local preview. */}
            <div className="relative">
              <img
                src={uploadedImageUrl || previewUrl}
                alt="Product preview"
                className="w-full h-48 object-contain rounded-lg"
              />

              {!imageLoadingState && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white"
                  onClick={handleRemoveImage}
                >
                  <XIcon className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Upload only when the user clicks the button. */}
            {!uploadedImageUrl && (
              <Button
                type="button"
                className="w-full mt-4"
                onClick={uploadImageToCloudinary}
                disabled={imageLoadingState}
              >
                {imageLoadingState ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;