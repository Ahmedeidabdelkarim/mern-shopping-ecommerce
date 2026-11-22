import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
} from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();

  const { featureImageList } = useSelector(
    (state) => state.commonFeature
  );

  // This runs after Cloudinary upload succeeds
  useEffect(() => {
    if (!uploadedImageUrl) return;

    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        // Get updated images from database
        dispatch(getFeatureImages());

        // Reset upload component
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }, [uploadedImageUrl, dispatch]);

  function handleDeleteFeatureImage(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="p-6">
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyling={true}
      />

      {/* All feature images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {featureImageList?.map((featureImgItem) => (
          <div
            key={featureImgItem._id}
            className="relative group"
          >
            <img
              src={featureImgItem.image}
              alt="Feature"
              className="w-full h-[250px] object-fill rounded-lg"
            />

            <Button
              onClick={() =>
                handleDeleteFeatureImage(featureImgItem._id)
              }
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;