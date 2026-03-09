import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonProvider({ children }) {
  return (
    <SkeletonTheme
      baseColor="#1f2937"
      highlightColor="#374151"
      duration={1.2}
    >
      {children}
    </SkeletonTheme>
  );
}