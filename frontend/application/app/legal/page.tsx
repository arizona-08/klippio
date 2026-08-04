import type { Metadata } from 'next';
import LegalTableOfContents, { type LegalNavigationItem } from '../components/legal/LegalTableOfContents';

export const metadata: Metadata = {
  title: 'Informations légales | Klippio',
  description: "Mentions légales, politique de confidentialité et conditions générales d'utilisation de Klippio.",
  alternates: { canonical: '/legal' },
};

const navigationItems: LegalNavigationItem[] = [
  { id: 'mentions-legales', label: 'Mentions légales' },
  { id: 'politique-de-confidentialite', label: 'Politique de confidentialité' },
  { id: 'cgu', label: "Conditions Générales d’Utilisation" },
];

type LegalSectionProps = {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
};

function LegalSection({ id, index, title, children }: LegalSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-8 rounded-2xl p-6 sm:p-9">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
          {index}
        </span>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Informations légales</p>
      </div>
      <h2 id={`${id}-title`} className="mt-5 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
        {title}
      </h2>
      <div className="mt-7 max-w-2xl space-y-7 text-[15px] leading-7 text-gray-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}

function LegalPlaceholder({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 id={id} className="text-base font-semibold text-gray-950">{title}</h3>
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  );
}

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold text-primary">Klippio</p>
          <h1 id="informations-legales" className="mt-3 text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
            Informations légales
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
            Retrouvez les informations qui encadrent l’utilisation de la plateforme Klippio.
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-8">
            <LegalTableOfContents items={navigationItems} />
          </aside>

          <div className="space-y-10">
            <LegalSection id="mentions-legales" index="01" title="Mentions légales">
              <LegalPlaceholder id="editeur-de-l-application" title="Éditeur de l’application">
                <p>Le site internet et l’application Klippio sont édités par :</p>
                <address className="not-italic">
                  <strong className="font-semibold text-gray-950">SAJED Engineering</strong>
                  <br />
                  Société par Actions Simplifiée (SAS)
                  <br />
                  Siège social : 10 rue des Semailles, 77230 Rouvres, France
                  <br />
                  SIREN : 889 032 157
                  <br />
                  TVA intracommunautaire : FR03 889032157
                </address>
                <p>Directeur de la publication : Marc ASSI</p>
                <p>
                  Pour toute question relative à l’application, vous pouvez nous contacter à l’adresse suivante :{' '}
                  <a className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="mailto:marc-assi@sajed-engineering.com">
                    marc-assi@sajed-engineering.com
                  </a>
                </p>
              </LegalPlaceholder>

              <LegalPlaceholder id="hebergement" title="Hébergement">
                <p>L’application Klippio est hébergée sur une infrastructure fournie par OVHcloud.</p>
                <p>Les données de l’application sont hébergées sur un serveur privé virtuel (VPS) situé au sein de l’Union européenne.</p>
                <p>Les fichiers importés par les utilisateurs (plans, photographies et documents) sont stockés de manière sécurisée sur le service Amazon Simple Storage Service (Amazon S3).</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="presentation-de-l-application" title="Présentation de l’application">
                <p>Klippio est une application web destinée au suivi de chantier et à la gestion collaborative des observations techniques.</p>
                <p>Elle permet notamment :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary">
                  <li>de gérer des projets de construction ou de rénovation ;</li>
                  <li>d’importer des plans ;</li>
                  <li>de positionner des marqueurs sur les plans ;</li>
                  <li>d’associer des photographies, commentaires et informations techniques aux marqueurs ;</li>
                  <li>de collaborer entre plusieurs utilisateurs sur un même projet ;</li>
                  <li>de générer des rapports de chantier.</li>
                </ul>
              </LegalPlaceholder>

              <LegalPlaceholder id="propriete-intellectuelle" title="Propriété intellectuelle">
                <p>L’ensemble des éléments composant Klippio, notamment les textes, logos, graphismes, illustrations, interfaces, éléments visuels, logiciels, bases de données et codes sources, est protégé par les dispositions du Code de la propriété intellectuelle.</p>
                <p>Sauf autorisation écrite préalable de SAJED Engineering, toute reproduction, représentation, modification, diffusion ou exploitation, totale ou partielle, de ces éléments est interdite.</p>
                <p>Les contenus importés par les utilisateurs (plans, photographies, documents, commentaires ou tout autre fichier) demeurent la propriété de leurs auteurs ou de leurs titulaires de droits.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="responsabilite" title="Responsabilité">
                <p>SAJED Engineering met en œuvre tous les moyens raisonnables afin d’assurer la disponibilité et le bon fonctionnement de Klippio.</p>
                <p>Toutefois, l’éditeur ne peut garantir une disponibilité permanente du service et ne saurait être tenu responsable d’une interruption temporaire, d’une indisponibilité, d’une opération de maintenance, d’un incident technique ou d’un cas de force majeure.</p>
                <p>L’utilisateur demeure seul responsable des informations, documents et contenus qu’il importe ou crée dans l’application.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="liens-externes" title="Liens externes">
                <p>Klippio peut contenir des liens vers des sites ou services tiers.</p>
                <p>SAJED Engineering ne peut être tenue responsable du contenu, du fonctionnement ou de la politique de confidentialité de ces services externes.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="protection-des-donnees-personnelles" title="Protection des données personnelles">
                <p>Klippio collecte et traite certaines données personnelles nécessaires au fonctionnement de l’application.</p>
                <p>Les modalités de collecte, d’utilisation, de conservation et de protection de ces données sont décrites dans la Politique de confidentialité.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="droit-applicable" title="Droit applicable">
                <p>Les présentes mentions légales sont régies par le droit français.</p>
                <p>Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence des juridictions territorialement compétentes du ressort du siège social de SAJED Engineering.</p>
              </LegalPlaceholder>
            </LegalSection>

            <LegalSection id="politique-de-confidentialite" index="02" title="Politique de confidentialité">
              <LegalPlaceholder id="preambule" title="1. Préambule">
                <p>La présente Politique de confidentialité a pour objet d’informer les utilisateurs de l’application Klippio sur la manière dont leurs données personnelles sont collectées, utilisées, protégées et conservées.</p>
                <p>SAJED Engineering attache une importance particulière à la protection de la vie privée de ses utilisateurs et s’engage à traiter leurs données personnelles dans le respect du Règlement Général sur la Protection des Données (RGPD) ainsi que de la législation française applicable.</p>
                <p>En utilisant Klippio, vous reconnaissez avoir pris connaissance de la présente politique.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="responsable-du-traitement" title="2. Responsable du traitement">
                <p>Le responsable du traitement des données est :</p>
                <address className="not-italic">
                  <strong className="font-semibold text-gray-950">SAJED Engineering</strong>
                  <br />
                  10 rue des Semailles
                  <br />
                  77230 Rouvres
                  <br />
                  France
                </address>
                <p>Adresse de contact :</p>
                <a className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="mailto:marc-assi@sajed-engineering.com">
                  marc-assi@sajed-engineering.com
                </a>
              </LegalPlaceholder>

              <LegalPlaceholder id="donnees-collectees" title="3. Données collectées">
                <p>Dans le cadre de son fonctionnement, Klippio est amené à collecter différentes catégories de données.</p>
                <h4 id="donnees-liees-au-compte-utilisateur" className="pt-1 font-semibold text-gray-950">Données liées au compte utilisateur</h4>
                <p>Lors de la création d’un compte, les informations suivantes peuvent être enregistrées :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary">
                  <li>nom ;</li><li>prénom ;</li><li>adresse électronique ;</li><li>photo de profil.</li>
                </ul>
                <p>Les mots de passe ne sont jamais enregistrés en clair. Ils sont protégés par un algorithme de hachage utilisant bcrypt.</p>
                <h4 id="donnees-relatives-aux-projets" className="pt-1 font-semibold text-gray-950">Données relatives aux projets</h4>
                <p>Dans le cadre de l’utilisation de l’application, les utilisateurs peuvent créer ou modifier des données telles que :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary">
                  <li>projets ;</li><li>plans de chantier ;</li><li>pages de plans ;</li><li>marqueurs ;</li><li>photographies ;</li><li>commentaires ;</li><li>rapports générés.</li>
                </ul>
                <p>Ces informations sont considérées comme des données métier nécessaires au fonctionnement de Klippio.</p>
                <h4 id="documents-importes" className="pt-1 font-semibold text-gray-950">Documents importés</h4>
                <p>Les utilisateurs peuvent importer différents fichiers, notamment :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>plans au format PDF ;</li><li>photographies ;</li><li>documents liés aux projets.</li></ul>
                <p>Ces fichiers sont stockés de manière sécurisée sur Amazon S3.</p>
                <h4 id="donnees-techniques" className="pt-1 font-semibold text-gray-950">Données techniques</h4>
                <p>Lors de l’utilisation du service, certaines informations techniques peuvent être traitées afin d’assurer le bon fonctionnement de l’application, notamment :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>informations de session ;</li><li>journaux techniques nécessaires à la sécurité et à la maintenance du service.</li></ul>
              </LegalPlaceholder>

              <LegalPlaceholder id="finalites-du-traitement" title="4. Finalités du traitement">
                <p>Les données personnelles sont utilisées exclusivement afin de :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>permettre l’authentification des utilisateurs ;</li><li>gérer les comptes utilisateurs ;</li><li>permettre la collaboration sur les projets ;</li><li>enregistrer les observations de chantier ;</li><li>générer les rapports de chantier ;</li><li>assurer le bon fonctionnement de l’application ;</li><li>garantir la sécurité du service ;</li><li>répondre aux demandes d’assistance.</li></ul>
                <p>Les données ne sont jamais revendues à des tiers.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="base-legale-du-traitement" title="5. Base légale du traitement">
                <p>Les traitements réalisés par Klippio reposent notamment sur :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>l’exécution du contrat permettant la fourniture du service ;</li><li>l’intérêt légitime de SAJED Engineering pour assurer la sécurité et l’amélioration de l’application ;</li><li>le respect des obligations légales applicables.</li></ul>
              </LegalPlaceholder>

              <LegalPlaceholder id="destinataires-des-donnees" title="6. Destinataires des données">
                <p>Les données sont accessibles uniquement :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>aux utilisateurs autorisés des projets auxquels ils participent ;</li><li>aux administrateurs disposant des droits appropriés au sein de l’application ;</li><li>aux personnes habilitées de SAJED Engineering lorsque cela est strictement nécessaire pour assurer la maintenance ou le support technique.</li></ul>
                <p>Les administrateurs peuvent notamment :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>modifier les informations d’un utilisateur ;</li><li>réinitialiser son mot de passe ;</li><li>consulter les projets dont il est propriétaire ou collaborateur.</li></ul>
              </LegalPlaceholder>

              <LegalPlaceholder id="hebergement-des-donnees" title="7. Hébergement des données">
                <p>Les données sont hébergées au sein de l’Union européenne.</p>
                <p>Les fichiers importés sont stockés sur Amazon S3.</p>
                <p>Les données applicatives sont hébergées sur une infrastructure OVHcloud.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="conservation-des-donnees" title="8. Conservation des données">
                <p>Les données personnelles sont conservées uniquement pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées.</p>
                <p>Lorsqu’un utilisateur supprime son compte :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>les informations liées à son compte sont supprimées ;</li><li>les contributions réalisées au sein des projets peuvent être conservées afin de préserver l’intégrité et l’historique des projets, tant que ceux-ci existent.</li></ul>
              </LegalPlaceholder>

              <LegalPlaceholder id="securite" title="9. Sécurité">
                <p>SAJED Engineering met en œuvre des mesures techniques et organisationnelles destinées à protéger les données personnelles contre toute perte, altération, divulgation ou accès non autorisé.</p>
                <p>Ces mesures comprennent notamment :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>l’utilisation du protocole HTTPS ;</li><li>le stockage sécurisé des mots de passe à l’aide de bcrypt ;</li><li>une gestion des droits d’accès selon les rôles des utilisateurs.</li></ul>
                <p>Malgré ces précautions, aucun système informatique ne peut garantir une sécurité absolue.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="cookies" title="10. Cookies">
                <p>Klippio utilise uniquement les cookies strictement nécessaires à son fonctionnement.</p>
                <p>Ces cookies permettent notamment :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>de maintenir la session de l’utilisateur ;</li><li>d’assurer son authentification ;</li><li>de garantir la sécurité de la navigation.</li></ul>
                <p>Aucun cookie publicitaire ou de suivi marketing n’est utilisé.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="vos-droits" title="11. Vos droits">
                <p>Conformément au RGPD, chaque utilisateur dispose des droits suivants :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>droit d’accès ;</li><li>droit de rectification ;</li><li>droit d’effacement ;</li><li>droit à la limitation du traitement ;</li><li>droit d’opposition lorsque celui-ci est applicable.</li></ul>
                <p>Toute demande peut être adressée à :</p>
                <a className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="mailto:marc-assi@sajed-engineering.com">
                  marc-assi@sajed-engineering.com
                </a>
                <p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez également déposer une réclamation auprès de la CNIL.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="modification-de-la-politique" title="12. Modification de la présente politique">
                <p>SAJED Engineering se réserve le droit de modifier la présente Politique de confidentialité afin de tenir compte des évolutions législatives, réglementaires ou techniques.</p>
                <p>En cas de modification substantielle, les utilisateurs seront informés par tout moyen approprié.</p>
              </LegalPlaceholder>
            </LegalSection>

            <LegalSection id="cgu" index="03" title="Conditions Générales d’Utilisation">
              <LegalPlaceholder id="objet-des-cgu" title="1. Objet">
                <p>Les présentes Conditions Générales d’Utilisation (CGU) ont pour objet de définir les conditions dans lesquelles les utilisateurs peuvent accéder et utiliser l’application Klippio.</p>
                <p>Toute utilisation de Klippio implique l’acceptation pleine et entière des présentes CGU.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="presentation-du-service" title="2. Présentation du service">
                <p>Klippio est une application web développée par SAJED Engineering permettant aux professionnels du bâtiment de gérer leurs projets de chantier.</p>
                <p>L’application permet notamment :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>la création et la gestion de projets ;</li><li>l’importation de plans ;</li><li>la création de marqueurs sur les plans ;</li><li>l’ajout de photographies et de commentaires ;</li><li>la collaboration entre plusieurs utilisateurs ;</li><li>la génération de rapports de chantier.</li></ul>
                <p>Les fonctionnalités peuvent évoluer à tout moment afin d’améliorer le service.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="creation-d-un-compte" title="3. Création d’un compte">
                <p>L’utilisation de Klippio nécessite la création d’un compte utilisateur.</p>
                <p>L’utilisateur s’engage à fournir des informations exactes, complètes et à jour lors de son inscription.</p>
                <p>Chaque compte est strictement personnel.</p>
                <p>L’utilisateur est responsable de la confidentialité de ses identifiants de connexion.</p>
                <p>Il s’engage à informer SAJED Engineering dans les meilleurs délais en cas d’utilisation frauduleuse ou non autorisée de son compte.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="acces-au-service" title="4. Accès au service">
                <p>SAJED Engineering met tout en œuvre pour assurer l’accessibilité de Klippio.</p>
                <p>Toutefois, l’accès au service peut être temporairement interrompu notamment en raison :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>d’opérations de maintenance ;</li><li>d’évolutions techniques ;</li><li>d’incidents indépendants de la volonté de l’éditeur ;</li><li>de cas de force majeure.</li></ul>
                <p>Ces interruptions n’ouvrent droit à aucune indemnisation.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="utilisation-du-service" title="5. Utilisation du service">
                <p>L’utilisateur s’engage à utiliser Klippio conformément à sa destination et dans le respect des lois et réglementations en vigueur.</p>
                <p>Il est notamment interdit de :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>tenter d’accéder frauduleusement au système ou aux données d’autres utilisateurs ;</li><li>perturber le fonctionnement de l’application ;</li><li>contourner les mécanismes de sécurité ;</li><li>importer des contenus illicites, diffamatoires, violents, haineux, pornographiques ou portant atteinte aux droits de tiers ;</li><li>transmettre des virus, logiciels malveillants ou tout autre code susceptible de compromettre le fonctionnement du service ;</li><li>utiliser des robots, scripts ou outils automatisés afin d’extraire les données de l’application (scraping) ;</li><li>détourner Klippio de son usage prévu.</li></ul>
              </LegalPlaceholder>

              <LegalPlaceholder id="donnees-des-utilisateurs" title="6. Données des utilisateurs">
                <p>Les utilisateurs restent propriétaires des documents, plans, photographies, commentaires et autres contenus qu’ils importent dans Klippio.</p>
                <p>Ils garantissent disposer des droits nécessaires pour utiliser et partager ces contenus.</p>
                <p>Ils demeurent seuls responsables des informations qu’ils mettent à disposition via l’application.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="administration-des-comptes" title="7. Administration des comptes">
                <p>Les administrateurs disposent de droits spécifiques leur permettant notamment :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>d’inviter de nouveaux utilisateurs ;</li><li>de gérer les droits d’accès aux projets ;</li><li>de modifier les informations d’un utilisateur ;</li><li>de réinitialiser le mot de passe d’un utilisateur ;</li><li>de consulter les projets dont un utilisateur est propriétaire ou collaborateur.</li></ul>
                <p>Ces actions doivent être réalisées dans le respect des droits des utilisateurs et des règles internes de leur organisation.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="suspension-ou-suppression-d-un-compte" title="8. Suspension ou suppression d’un compte">
                <p>SAJED Engineering se réserve le droit de suspendre ou supprimer tout compte utilisateur en cas de :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>non-respect des présentes CGU ;</li><li>utilisation frauduleuse du service ;</li><li>tentative d’intrusion ou de piratage ;</li><li>diffusion de contenus illicites ;</li><li>atteinte à la sécurité de l’application ;</li><li>comportement susceptible de nuire au bon fonctionnement de Klippio ou à ses utilisateurs.</li></ul>
                <p>Lorsque cela est possible, l’utilisateur concerné sera informé avant toute suppression définitive de son compte.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="propriete-intellectuelle-cgu" title="9. Propriété intellectuelle">
                <p>Klippio ainsi que l’ensemble de ses éléments graphiques, techniques et fonctionnels demeurent la propriété exclusive de SAJED Engineering.</p>
                <p>Aucune disposition des présentes CGU ne saurait être interprétée comme transférant un quelconque droit de propriété intellectuelle aux utilisateurs.</p>
                <p>Toute reproduction, modification, décompilation ou exploitation non autorisée de Klippio est interdite.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="responsabilite-cgu" title="10. Responsabilité">
                <p>SAJED Engineering met en œuvre les moyens raisonnables afin d’assurer le bon fonctionnement de Klippio.</p>
                <p>Toutefois, l’éditeur ne saurait être tenu responsable :</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-primary"><li>des dommages résultant d’une mauvaise utilisation de l’application ;</li><li>des pertes de données imputables aux utilisateurs ;</li><li>des interruptions temporaires du service ;</li><li>des conséquences liées aux contenus importés par les utilisateurs.</li></ul>
                <p>Les utilisateurs demeurent responsables de la sauvegarde de leurs propres données lorsque cela est nécessaire.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="protection-des-donnees-personnelles-cgu" title="11. Protection des données personnelles">
                <p>Les traitements de données personnelles réalisés dans le cadre de Klippio sont décrits dans la <a className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" href="/legal#politique-de-confidentialite">Politique de confidentialité</a> de l’application.</p>
                <p>Chaque utilisateur est invité à la consulter afin de connaître ses droits et les modalités de traitement de ses données.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="evolution-des-cgu" title="12. Évolution des CGU">
                <p>SAJED Engineering peut être amenée à modifier les présentes Conditions Générales d’Utilisation afin de tenir compte des évolutions techniques, fonctionnelles ou réglementaires.</p>
                <p>Les utilisateurs seront informés de toute modification importante par tout moyen approprié.</p>
              </LegalPlaceholder>

              <LegalPlaceholder id="droit-applicable-cgu" title="13. Droit applicable">
                <p>Les présentes CGU sont régies par le droit français.</p>
                <p>Tout litige relatif à leur interprétation, leur validité ou leur exécution relève de la compétence des juridictions territorialement compétentes du ressort du siège social de SAJED Engineering.</p>
              </LegalPlaceholder>
            </LegalSection>
          </div>
        </div>
      </div>
    </main>
  );
}
