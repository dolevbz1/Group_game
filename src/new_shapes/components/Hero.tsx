import AISearch from './AISearch';
import './Hero.css';

type HeroProps = {
  onSearchSubmit?: (text: string, rect: DOMRect) => void;
};

export default function Hero({ onSearchSubmit }: HeroProps) {
  return (
    <section className="hero" dir="rtl">
      <AISearch onSubmit={onSearchSubmit} />
    </section>
  );
}
