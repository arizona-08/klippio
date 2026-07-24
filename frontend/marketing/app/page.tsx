import Image from "next/image";
import Link from "next/link";

const applicationUrl = "https://app.klippio.sajed-engineering.com";

const features = [
  {
    number: "01",
    title: "Visualisez le chantier",
    text: "Ouvrez le plan, zoomez et retrouvez chaque observation exactement là où elle a été relevée.",
  },
  {
    number: "02",
    title: "Documentez sur place",
    text: "Ajoutez une photo, un libellé et le contexte nécessaire pour que la bonne personne puisse intervenir.",
  },
  {
    number: "03",
    title: "Partagez une vision claire",
    text: "Les équipes disposent du même niveau d’information, sans devoir reconstituer les échanges en fin de journée.",
  },
];

export default function Home() {


  return (
    <main className="min-h-screen overflow-hidden bg-white font-(--font-body) text-[#101612]">

      <div className=" px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
        <section className="relative overflow-hidden rounded-4xl border border-black/5 bg-[#f9fbfe] px-5 pt-5 shadow-[0_28px_70px_-52px_rgba(16,22,18,0.55)] sm:px-8 sm:pt-7">
          <div className="absolute left-1/2 top-28 h-96 w-[min(80vw,780px)] -translate-x-1/2 rounded-full bg-white/80 blur-3xl" />
          <header className="relative z-10 flex items-center justify-between">
            <Link href="/" className="flex items-center" aria-label="Klippio, accueil">
              <Image src="/logos/logo_long_black.svg" alt="Klippio" width={112} height={32} priority />
            </Link>
            <div className="flex items-center gap-2 sm:gap-5">
              <a className="hidden text-sm font-semibold text-gray-700 transition-colors hover:text-primary sm:inline-flex" href="#contact">Nous contacter</a>
              <a className="rounded-xl bg-[#101612] px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-primary sm:px-5" href={`${applicationUrl}/auth/register`}>Commencer</a>
            </div>
          </header>

          <div className="relative z-10 mx-auto max-w-3xl pb-10 pt-16 text-center sm:pb-14 sm:pt-20">
            <h1 className="font-[var(--font-display)] text-4xl font-semibold leading-[0.98] tracking-[-0.06em] text-[#101612] sm:text-5xl lg:text-6xl">Pilotez chaque <span className="text-primary">observation</span><br />sans perdre le plan.</h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">Klippio rassemble les réserves, photos et commentaires de chantier dans une vue claire, partagée par toute l&apos;équipe.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <a className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#009a56] hover:shadow-md" href={`${applicationUrl}/auth/register`}>Créer un projet</a>
              <a className="rounded-xl border border-primary bg-white/70 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white" href="#methode">En savoir plus</a>
            </div>
          </div>

          <div className="relative z-10 mx-auto max-w-[1100px] rounded-t-2xl border-x border-t border-white/80 bg-white/60 p-1.5 shadow-[0_-14px_34px_-28px_rgba(16,22,18,0.55)] sm:p-2.5">
            <div className="overflow-hidden rounded-t-xl border border-gray-200 bg-white">
              <Image src="/images/application_shots/plan_loader.png" alt="Plan interactif d'un chantier dans l'application Klippio" width={1920} height={911} priority className="h-auto w-full" sizes="(max-width: 1280px) 100vw, 76vw" />
            </div>
          </div>
        </section>
      </div>

      <section id="fonctionnalites" className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-[1320px] px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Les fondamentaux Klippio</p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Un flux simple, de la constatation à la résolution.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.number} className="rounded-2xl border border-gray-200 bg-[#fafcfb] p-6 transition-transform hover:-translate-y-1 hover:shadow-md">
                <span className="text-sm font-bold text-primary">{feature.number}</span>
                <h3 className="mt-8 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-600">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="methode" className="mx-auto grid max-w-[1320px] gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:px-8">
        <div className="max-w-md">
          <p className="inline-flex rounded-full border border-gray-200 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-600">Avantages</p>
          <h2 className="mt-5 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Pourquoi choisir <span className="text-primary">Klippio</span> ?</h2>
          <p className="mt-5 text-sm leading-7 text-gray-600">Un outil conçu pour réduire la friction entre la constatation sur site, la compréhension du problème et son suivi par les équipes.</p>
          <a className="mt-7 inline-flex rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white" href={`${applicationUrl}/auth/register`}>Essayer l&apos;application</a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">01</span>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">Une vision partagée</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">Chaque remarque est positionnée sur le même plan, pour que chacun parle du même endroit.</p>
          </article>
          <article className="rounded-2xl bg-[linear-gradient(135deg,#00af63_0%,#009a56_55%,#087044_100%)] p-6 text-white shadow-[0_20px_42px_-28px_rgba(0,130,75,0.8)]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white">02</span>
            <h3 className="mt-8 text-lg font-semibold">Des informations exploitables</h3>
            <p className="mt-3 text-sm leading-6 text-white/80">Photo, libellé et commentaire restent réunis pour comprendre une observation sans aller-retour inutile.</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">03</span>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">Un suivi plus fluide</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">Les équipes retrouvent rapidement les points ouverts et peuvent se concentrer sur les actions à mener.</p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">04</span>
            <h3 className="mt-8 text-lg font-semibold text-gray-900">Adapté au terrain</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">Une interface claire sur ordinateur, tablette ou mobile, pensée pour être utile directement sur chantier.</p>
          </article>
        </div>
      </section>

      <section id="contact" className="px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-7 rounded-[28px] bg-[#101d16] px-6 py-10 text-white sm:px-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#77dfaa]">Klippio par SAJED Engineering</p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">Prêt à remettre le plan au centre du chantier ?</h2>
            <p className="mt-4 text-sm leading-6 text-white/65">Créez votre espace Klippio et centralisez vos observations dès le premier projet.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#009a56]" href={`${applicationUrl}/auth/register`}>Accéder à Klippio</a>
            <a className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10" href="https://sajed-engineering.com">Découvrir SAJED Engineering</a>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1320px] flex-col gap-3 px-6 py-8 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© {new Date().getFullYear()} Klippio, une solution SAJED Engineering.</p>
        <div className="flex gap-5"><a className="hover:text-primary" href={applicationUrl}>Application Klippio</a><a className="hover:text-primary" href="https://sajed-engineering.com">sajed-engineering.com</a></div>
      </footer>
    </main>
  );
}
