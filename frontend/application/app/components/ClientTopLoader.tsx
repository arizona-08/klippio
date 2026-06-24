'use client'

import NextTopLoader from 'nextjs-toploader'

function ClientTopLoader() {
  return (
    <NextTopLoader
      color="#10B981" // Le code HEX du vert de ton application
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false} // Désactive le petit spinner circulaire en haut à droite si tu ne veux que la barre
      easing="ease"
      speed={200}
      shadow="0 0 10px #10B981,0 0 5px #10B981" // Effet de lueur (glow)
    />
  )
}

export default ClientTopLoader
