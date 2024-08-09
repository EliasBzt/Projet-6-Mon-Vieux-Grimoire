const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');


dotenv.config();

const port = 3000;


mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
  
    app.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
    });
  })
  .catch((error) => console.error('Connexion à MongoDB échouée :', error)); 
