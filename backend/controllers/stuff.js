const Book = require('../models/Book');

exports.createBook = (req, res, next) => {
  if (!req.body.book) {
    return res.status(400).json({ error: 'Le champ book est manquant' });
  }

  let bookObject;
  try {
    bookObject = JSON.parse(req.body.book);
  } catch (error) {
    return res.status(400).json({ error: 'Le champ book contient une chaîne JSON non valide' });
  }

  delete bookObject._id;
  delete bookObject._userId;

  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre enregistré avec succès !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
  Book.find().then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({ error });
    }
  );
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }).then(
    (book) => {
      res.status(200).json(book);
    }
  ).catch(
    (error) => {
      res.status(404).json({ error });
    }
  );
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ?
    {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).json({ error: new Error('Livre non trouvé !') });
      }
      if (book.userId !== req.auth.userId) {
        return res.status(403).json({ error: new Error('Requête non autorisée !') });
      }
      Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié avec succès !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.deleteOne({ _id: req.params.id }).then(
    () => {
      res.status(200).json({ message: 'Livre supprimé avec succès !' });
    }
  ).catch(
    (error) => {
      res.status(400).json({ error });
    }
  );
};

exports.rateBook = (req, res, next) => {
  const { userId, rating } = req.body;

  if (rating < 0 || rating > 5) {
    return res.status(400).json({ error: 'La note doit être comprise entre 0 et 5.' });
  }

  Book.findOne({ _id: req.params.id }).then(
    (book) => {
      if (!book) {
        return res.status(404).json({ error: 'Livre non trouvé !' });
      }

      const userRating = book.ratings.find(r => r.userId === userId);
      if (userRating) {
        return res.status(400).json({ error: 'Vous avez déjà noté ce livre !' });
      }

      book.ratings.push({ userId, grade: rating });

      book.averageRating = book.ratings.reduce((acc, curr) => acc + curr.grade, 0) / book.ratings.length;

      book.save()
        .then(() => res.status(200).json(book))
        .catch(error => res.status(400).json({ error }));
    }
  ).catch(
    (error) => {
      res.status(400).json({ error });
    }
  );
};

exports.getBestRatedBooks = (req, res, next) => {
  Book.find().sort({ averageRating: -1 }).limit(3).then(
    (books) => {
      res.status(200).json(books);
    }
  ).catch(
    (error) => {
      res.status(400).json({ error });
    }
  );
};
