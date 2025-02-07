'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImagesProps {
  featureImage: string | null;
  setFeatureImage: (imageId: string | null) => void;
}

export default function Images({ featureImage, setFeatureImage }: ImagesProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(featureImage);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFeatureImage(reader.result as string);
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="p-5 bg-white border rounded-xl shadow-md">
      <h2 className="font-semibold text-lg mb-4">Upload Image</h2>

      {/* Upload Button */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mb-3"
      />

      {/* Display Uploaded Image (Next.js Optimized) */}
      {previewUrl && (
        <div className="relative w-40 h-40 mt-3">
          <Image
            src={previewUrl}
            alt="Product"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}
    </section>
  );
}
