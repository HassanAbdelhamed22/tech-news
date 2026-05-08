import { useSelector } from "react-redux";
import Card from "./Card";
import {
  selectUserReaction,
  selectIsBookmarked,
} from "../../store/slices/newsSlice";

/**
 * Wraps <Card> and reads per-item reaction/bookmark state from Redux
 * using memoized selectors — so each card only re-renders when its own data changes.
 */
const CardWrapper = ({ item, userId, onLike, onDislike, onBookmark }) => {
  const userAction = useSelector(selectUserReaction(userId, item.id));
  const isBookmarked = useSelector(selectIsBookmarked(userId, item.id));

  return (
    <Card
      {...item}
      userAction={userAction}
      isBookmarked={isBookmarked}
      onLike={onLike}
      onDislike={onDislike}
      onBookmark={onBookmark}
    />
  );
};

export default CardWrapper;
