import { MARQUEE_ITEMS } from '../data/content';
import { useAdminData } from '../context/AdminDataContext.jsx';

export default function Marquee() {
  const { data } = useAdminData();
  const baseItems = data?.announcement ? [data.announcement, ...MARQUEE_ITEMS] : MARQUEE_ITEMS;
  const items = [...baseItems, ...baseItems];

  return (
    <div className="marquee-strip">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </div>
  );
}
