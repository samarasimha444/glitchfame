import React from "react";

// Helper to generate Cloudinary URLs for WebP and JPEG with srcSet
const getCloudinarySrcSet = (url) => {
  if (!url) return null;

  return {
    webpSrc: url.replace("/upload/", "/upload/f_webp,w_300,q_auto/"),
    webpSrcSet: `
${url.replace("/upload/", "/upload/f_webp,w_150,q_auto:low/")} 150w,
${url.replace("/upload/", "/upload/f_webp,w_300,q_auto/")} 300w,
${url.replace("/upload/", "/upload/f_webp,w_600,q_auto/")} 600w
`,
    jpgSrc: url.replace("/upload/", "/upload/f_auto,w_300,q_auto/"),
    jpgSrcSet: `
${url.replace("/upload/", "/upload/f_auto,w_150,q_auto:low/")} 150w,
${url.replace("/upload/", "/upload/f_auto,w_300,q_auto/")} 300w,
${url.replace("/upload/", "/upload/f_auto,w_600,q_auto/")} 600w
`,
  };
};

// Default fallback images
const FALLBACK_WEBP =
  "https://res.cloudinary.com/dxt9cvxmg/image/upload/f_webp,w_300,q_auto/v1775192878/seasons/register/banner/dh5ftc0nzp0bsmti9qrs.webp";
const FALLBACK_JPG =
  "https://res.cloudinary.com/dxt9cvxmg/image/upload/v1775192878/seasons/register/banner/dh5ftc0nzp0bsmti9qrs.jpg";

const CloudinaryImage = ({ url, alt, className }) => {
  const { webpSrc, webpSrcSet, jpgSrc, jpgSrcSet } = getCloudinarySrcSet(url) || {};

  return (
    <picture>
      {/* WebP first */}
      <source
        type="image/webp"
        srcSet={webpSrcSet || FALLBACK_WEBP}
        src={webpSrc || FALLBACK_WEBP}
      />
      {/* JPEG fallback */}
      <source
        type="image/jpeg"
        srcSet={jpgSrcSet || FALLBACK_JPG}
        src={jpgSrc || FALLBACK_JPG}
      />
      <img
        src={webpSrc || jpgSrc || FALLBACK_WEBP}
        alt={alt || "participant"}
        className={className || "w-full h-full object-cover"}
        loading="lazy"
        decoding="async"
        onError={(e) => {
          // fallback to WebP if original fails
          e.currentTarget.src = FALLBACK_WEBP;
        }}
      />
    </picture>
  );
};

export default CloudinaryImage;