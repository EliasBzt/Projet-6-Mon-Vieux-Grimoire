const mongoose = require('mongoose');
const app = require('./app');

const port = 3000;


mongoose.connect('mongodb+srv://Elios_Kng:f2U9U4Gc7bS5j0mI@cluster0.u39qz38.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
    });
  })
  .catch((error) => console.error('Connexion à MongoDB échouée :', error));
