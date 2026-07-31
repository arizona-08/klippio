'use client';

import { useEffect, useState } from 'react';

export type LegalNavigationItem = {
  id: string;
  label: string;
};

type LegalTableOfContentsProps = {
  items: LegalNavigationItem[];
};

/**
 * Navigation d'ancres réutilisable pour les pages documentaires longues.
 */
export default function LegalTableOfContents({ items }: LegalTableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const updateFromHash = () => {
      const idFromHash = window.location.hash.slice(1);

      if (items.some((item) => item.id === idFromHash)) {
        setActiveId(idFromHash);
      }
    };

    updateFromHash();
    window.addEventListener('hashchange', updateFromHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '-16% 0px -68% 0px', threshold: [0, 0.1, 0.5] },
    );

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener('hashchange', updateFromHash);
      observer.disconnect();
    };
  }, [items]);

  return (
    <nav aria-label="Sommaire des informations légales" className="rounded-2xl p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Sommaire</p>
      <ol className="mt-4 space-y-1 border-l border-stroke">
        {items.map((item, index) => {
          const isActive = activeId === item.id;

          return (
            <li key={item.id}>
              <a
                aria-current={isActive ? 'location' : undefined}
                className={`group -ml-px flex items-center gap-3 border-l-2 py-2.5 pl-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:border-primary hover:text-gray-950'
                }`}
                href={`/legal#${item.id}`}
              >
                <span aria-hidden="true" className="text-xs tabular-nums text-gray-400 group-hover:text-primary">
                  0{index + 1}
                </span>
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
