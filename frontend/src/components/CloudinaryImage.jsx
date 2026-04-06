// CloudinaryImage.jsx
import React from "react";

// Helper function to generate Cloudinary src and srcSet
const getCloudinarySrcSet = (url) => {
  if (!url) return null;

  const src = url.replace("/upload/", "/upload/f_webp,w_300,q_auto/");

  const srcSet = `
    ${url.replace("/upload/", "/upload/f_webp,w_150,q_auto:low/")} 150w,
    ${url.replace("/upload/", "/upload/f_webp,w_300,q_auto/")} 300w,
    ${url.replace("/upload/", "/upload/f_webp,w_600,q_auto/")} 600w
  `;

  return { src, srcSet };
};

const CloudinaryImage = ({ url, alt, className }) => {
  const { src, srcSet } = getCloudinarySrcSet(url) || {};

  return (
    <img
      src={src || "https://res.cloudinary.com/dxt9cvxmg/image/upload/v1775192878/seasons/register/banner/dh5ftc0nzp0bsmti9qrs.jpg"}
      srcSet={srcSet || undefined}
      sizes="(max-width: 640px) 150px, (max-width: 1024px) 300px, 600px"
      alt={alt || "participant"}
      loading="lazy"
      decoding="async"
      className={className || "w-full h-full object-cover"}
    />
  );
};

export default CloudinaryImage;