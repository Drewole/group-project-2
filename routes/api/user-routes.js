const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  console.log(`\n\n ${req.body.username} \n\n ${req.body.password} \n\n`);
  // const userData = await User.create({username: req.body.username, password: req.body.password});
  // console.log(`\n\n ${userData} \n\n`);
  try {
    const userData = await User.create({username: req.body.username, password: req.body.password});

    console.log(`\n\n ${userData} \n\n`);
    
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.user_name = userData.username;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
      res.render('dashboard', { 
        posts, 
        logged_in: req.session.logged_in 
      });
    });
  } catch (err) {
    res.status(400).json(err);
    // res.send("test");
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save( () => {
      req.session.user_id = userData.id;
      req.session.user_name = userData.name;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
      res.render('dashboard', { 
        posts, 
        logged_in: req.session.logged_in 
      });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.render('homeLogin', { 
        logged_in: req.session.logged_in 
      });
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;