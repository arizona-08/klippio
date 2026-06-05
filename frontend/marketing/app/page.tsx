import Image from "next/image";
import { Inter, Manrope } from "next/font/google";

const display = Manrope({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export default function Home() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-white text-[#101612]`}
    >
      <header className="relative overflow-hidden border-b border-black/5">
        <div className="absolute -left-40 -top-24 h-72 w-72 rounded-full bg-[#00AF63]/10 blur-3xl" />
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#00AF63]/15 blur-3xl" />
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
          <div className="flex items-center gap-3">
            <div className="px-2 py-1">
              <Image
                src="/logos/logo_long_black.svg"
                alt="Klippio"
                width={120}
                height={34}
                priority
              />
            </div>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-black/70 lg:flex">
            <a className="transition hover:text-black" href="#fonctionnalites">
              Fonctionnalités
            </a>
            <a className="transition hover:text-black" href="#usage">
              Usage
            </a>
            <a className="transition hover:text-black" href="#resultats">
              Résultats
            </a>
            <a className="transition hover:text-black" href="#contact">
              Contact
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden rounded-full border border-black/10 px-5 py-2 text-sm font-medium text-black/70 transition hover:border-black/20 hover:text-black md:inline-flex">
              Se connecter
            </button>
            <button className="rounded-full bg-[#00AF63] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#009a56]">
              S'inscrire gratuitement
            </button>
          </div>
        </nav>
        <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-16 pt-6 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:pb-20">
          <div className="flex flex-col gap-6">
            <p className="w-fit rounded-full bg-[#00AF63]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#00AF63]">
              Gestion terrain en temps réel
            </p>
            <h1 className="font-[var(--font-display)] text-4xl leading-[1.05] tracking-tight text-black sm:text-5xl lg:text-6xl">
              Photographiez, placez, partagez tout sur le plan du chantier
            </h1>
            <p className="max-w-xl text-base leading-7 text-black/65 sm:text-lg">
              Klippio aide les équipes du batiment à capturer les défauts, les
              idées d'amélioration et les points de controle directement sur le
              plan. Fini les notes perdues, tout est au bon endroit avant la fin
              de la journée.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="rounded-full bg-[#00AF63] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#009a56]">
                Essayer gratuitement
              </button>
              <button className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold text-black/70 transition hover:border-black/30 hover:text-black">
                Voir une visite guidee
              </button>
            </div>
            <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-[0.2em] text-black/40">
              <span>Entreprises generales</span>
              <span>Architectes</span>
              <span>Bureaux d'études</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-6 top-10 h-40 w-40 rounded-full border border-black/10 bg-white/90" />
            <div className="absolute -right-4 bottom-10 h-20 w-20 rounded-full border border-black/10 bg-white/80" />
            <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-[#f7faf8] shadow-[0_30px_80px_-60px_rgba(0,0,0,0.6)]">
              <div className="grid grid-cols-[1.1fr_0.9fr] gap-0">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#00AF63]" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/50">
                      Plan interactif
                    </p>
                  </div>
                  <div className="mt-4 space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={`row-${index}`}
                        className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3"
                      >
                        <div className="space-y-2">
                          <div className="h-2.5 w-28 rounded-full bg-black/10" />
                          <div className="h-2.5 w-20 rounded-full bg-black/10" />
                        </div>
                        <div className="h-6 w-6 rounded-full bg-[#00AF63]/15" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative bg-[#00AF63] text-white">
                  <div className="absolute inset-0 opacity-20">
                    <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.5),_transparent_60%)]" />
                  </div>
                  <div className="relative flex h-full flex-col justify-between p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                        Jour 12
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        18 points ouverts
                      </p>
                      <p className="mt-2 text-sm text-white/80">
                        Photos classees par zone, validation en un clic.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/15 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                        Derniere capture
                      </p>
                      <p className="mt-2 text-sm text-white/85">
                        Etancheite facade Nord - a corriger avant reception.
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/30" />
                        <div>
                          <p className="text-xs font-semibold">Camille L.</p>
                          <p className="text-xs text-white/70">Il y a 12 min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </header>

      <section
        id="resultats"
        className="border-y border-black/5 bg-[#0d1a14] text-white"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr] md:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
              Resultats terrain
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl tracking-tight text-white sm:text-4xl">
              Chaque projet gagne en clarte et en rapidite
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "120%", label: "Reduction des aller-retours" },
              { value: "2x", label: "Validation plus rapide" },
              { value: "14h", label: "Temps gagne par semaine" },
              { value: "96%", label: "Photos retrouvees" },
            ].map((stat) => (
              <div key={stat.value} className="space-y-2">
                <p className="text-2xl font-semibold text-[#00AF63]">
                  {stat.value}
                </p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="fonctionnalites"
        className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10"
      >
        <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00AF63]">
              Un outil pense chantier
            </p>
            <h2 className="font-[var(--font-display)] text-3xl tracking-tight text-black sm:text-4xl">
              Le plan devient votre terrain de communication
            </h2>
            <p className="text-sm leading-7 text-black/65">
              Chaque photo est automatiquement positionnee sur le plan, taggee
              par zone et partagee avec les bonnes equipes. Les decisions sont
              tracees, les validations documentees.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Pointage precis",
                text: "Marquez un defaut, ajoutez une note vocale ou un commentaire.",
              },
              {
                title: "Photos instantanees",
                text: "Capturez, annotez et envoyez en quelques secondes.",
              },
              {
                title: "Suivi des actions",
                text: "Assignez une equipe, fixez une echeance, suivez l'avancement.",
              },
              {
                title: "Rapports exportables",
                text: "Partagez les points ouverts en PDF ou via un lien.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_18px_40px_-35px_rgba(0,0,0,0.35)]"
              >
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-[#00AF63]/10" />
                  <p className="text-sm font-semibold">{feature.title}</p>
                </div>
                <p className="mt-4 text-sm text-black/60">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="usage"
        className="mx-auto w-full max-w-6xl px-6 pb-20 md:px-10"
      >
        <div className="grid gap-10 rounded-[28px] border border-black/5 bg-[#f7faf8] p-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
              Comment ca marche
            </p>
            <h3 className="font-[var(--font-display)] text-2xl tracking-tight text-black sm:text-3xl">
              3 etapes terrain, zero paperasse
            </h3>
            <div className="space-y-4 text-sm text-black/65">
              <p>
                1. Ouvrez le plan du chantier sur mobile ou tablette.
              </p>
              <p>2. Capturez une photo et positionnez-la instantanement.</p>
              <p>
                3. Partagez les points ouverts avec les equipes et le client.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
                Equipe chantier
              </p>
              <p className="mt-3 text-sm text-black/65">
                "On retrouve instantanement toutes les photos et les remarques
                zone par zone. On ne perd plus une demi-journee a tout
                reconstituer."
              </p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
                Conducteur de travaux
              </p>
              <p className="mt-3 text-sm text-black/65">
                "Les validations sont fluides, et les rapports sont prets a
                envoyer en fin de journee."
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer
        id="contact"
        className="border-t border-black/5 bg-white"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-10">
          <div>
            <p className="font-semibold">Pret pour votre prochain chantier ?</p>
            <p className="text-sm text-black/60">
              Nos experts vous repondent en moins de 24h.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full bg-[#00AF63] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#009a56]">
              Planifier une demo
            </button>
            <button className="rounded-full border border-black/15 px-6 py-3 text-sm font-semibold text-black/70 transition hover:border-black/30 hover:text-black">
              Contacter l'equipe
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
