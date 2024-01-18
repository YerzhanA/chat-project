import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// eslint-disable-next-line react/prop-types
function SkeletonLoading({ height, count }) {
  //Скелетон поиска
  return (
    <div>
      <SkeletonTheme baseColor="#A5A5A5" highlightColor="#444">
        <Skeleton
          style={{ height: `${height}px`, width: "100%" }}
          count={count}
        />
      </SkeletonTheme>
    </div>
  );
}

export default SkeletonLoading;
