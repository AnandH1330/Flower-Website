import { useParams } from "react-router-dom";
import TrackOrderMap from "../components/TrackOrderMap";

const TrackOrderPage = () => {
  const { trackingId } = useParams();
  return <TrackOrderMap trackingId={trackingId} />;
};

export default TrackOrderPage;
