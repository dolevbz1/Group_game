import './PollsCard.css';


export default function PollsCard() {
  return (
    <div className="polls-body" dir="rtl">
      <div className="poll-card">
        <div className="poll-next-wrap">
          <p className="poll-next-note text-tiny-normal">הקול שלך יקבע את הסקר הבא</p>
          <button type="button" className="poll-next-cta text-small-bold">
            להצביע בסקר הבא
          </button>
        </div>
      </div>
    </div>
  );
}
