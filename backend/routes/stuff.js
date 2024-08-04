const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, optimizeImage } = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/stuff');

router.get('/bestrating', stuffCtrl.getBestRatedBooks); 
router.post('/', auth, upload.single('image'), optimizeImage, stuffCtrl.createBook);
router.get('/', stuffCtrl.getAllStuff);
router.get('/:id', stuffCtrl.getOneBook);
router.put('/:id', auth, upload.single('image'), optimizeImage, stuffCtrl.modifyBook);
router.delete('/:id', auth, stuffCtrl.deleteBook);
router.post('/:id/rating', auth, stuffCtrl.rateBook);

module.exports = router;
