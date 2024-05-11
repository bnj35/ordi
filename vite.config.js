import { resolve } from 'path'

export default {
  server:
    {
      host: true,
    },
  build:
    {
      outDir: './dist',
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions:{
        input:{
          main:resolve(__dirname,'./index.html'),
          troisD:resolve(__dirname,'./troisD.html'),
          Commande:resolve(__dirname,'./Commande.html'),
          Coursdev:resolve(__dirname,'./Coursdev.html'),
          Creation:resolve(__dirname,'./Creation.html'),
          cv:resolve(__dirname,'./cv.html'),
          Dev:resolve(__dirname,'./Dev.html'),
          etudiant:resolve(__dirname,'./etudiant.html'),
          graphiste:resolve(__dirname,'./graphiste.html'),
          parcours:resolve(__dirname,'./parcours.html'),
          presentation:resolve(__dirname,'./presentation.html'),
          room:resolve(__dirname,'./room.html'),
          travaux:resolve(__dirname,'./travaux.html'),
          video:resolve(__dirname,'./video.html'),
        },
        output:{
          manualChunks: {
            gsap: ['gsap'],
            three: ['three'],
          },
        }
      }
    },
}