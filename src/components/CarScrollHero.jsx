import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const headline = 'WELCOME ITZFIZZ';
const metrics = [
  { value: '58%', description: 'Increase in pick up point use', className: 'metric--lime' },
  { value: '23%', description: 'Decreased in customer phone calls', className: 'metric--blue' },
  { value: '27%', description: 'Increase in pick up point use', className: 'metric--charcoal' },
  { value: '40%', description: 'Decreased in customer phone calls', className: 'metric--orange' },
];

export default function CarScrollHero() {
  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const lettersRef = useRef([]);
  const metricsRef = useRef([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const road = roadRef.current;
    const car = carRef.current;
    const trail = trailRef.current;
    const letters = lettersRef.current;
    const cards = metricsRef.current;
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      gsap.set(car, { x: 0, autoAlpha: 0 });
      gsap.set(trail, { width: 75 });
      gsap.set(letters, { autoAlpha: 0 });
      gsap.set(cards, { autoAlpha: 0, y: 12, scale: 0.98, transformOrigin: 'center' });

      const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
      intro.to(car, { autoAlpha: 1, duration: 0.65 });

      if (reduced) {
        gsap.set([car, letters, cards], { clearProps: 'opacity,visibility,transform' });
        gsap.set(trail, { width: '24%' });
        return;
      }

      const travel = () => Math.max(0, road.clientWidth - car.getBoundingClientRect().width * 0.25);
      const animation = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      animation.to(car, { x: travel, duration: 1 }, 0);
      animation.to(trail, { width: () => travel() + car.getBoundingClientRect().width * 0.16, duration: 1 }, 0);
      animation.to(letters, {
        autoAlpha: 1,
        stagger: { each: 0.045, from: 0 },
        duration: 0.08,
        ease: 'none',
      }, 0.04);

      cards.forEach((card, index) => {
        const starts = [0.08, 0.28, 0.58, 0.78];
        animation.to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.08, ease: 'power1.out' }, starts[index]);
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="scene-section" ref={sectionRef} aria-label="Scroll controlled car animation">
      <div className="scene-track">
        <div className="road" ref={roadRef}>
          <div className="green-trail" ref={trailRef} aria-hidden="true" />
          <h1 className="headline" aria-label={headline}>
            {Array.from(headline).map((character, index) => (
              <span
                className={`headline-letter${character === ' ' ? ' headline-space' : ''}`}
                key={`${character}-${index}`}
                aria-hidden="true"
                ref={(node) => { lettersRef.current[index] = node; }}
              >{character === ' ' ? '\u00a0' : character}</span>
            ))}
          </h1>
          <img className="car" ref={carRef} src={`${import.meta.env.BASE_URL}car.png`} alt="Orange McLaren sports car viewed from above, facing right" />
        </div>
        {metrics.map((metric, index) => (
          <article
            className={`metric ${metric.className}`}
            key={metric.value}
            ref={(node) => { metricsRef.current[index] = node; }}
          >
            <strong>{metric.value}</strong>
            <span>{metric.description}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
