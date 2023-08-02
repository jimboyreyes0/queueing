const { Queue, SystemUser } = require('../models/models')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')

exports.getMainPageRender = async (req, res) => {
    if (!req.session?.user?.isLoggedIn) {
      return res.redirect('/');
    }
  
    try {
      const [currentQueue, pendingQueues] = await Promise.all([
        Queue.findOne({
          where: {
            status: 'Current'
          }
        }),
        Queue.findAll({
          where: {
            status: 'Pending'
          },
          order: [['date', 'ASC']],
          limit: 3
        })
      ]);
  
      const queueRenderData = {
        currentQueue: [],
        pendingQueue: []
      };
  
      if (currentQueue) {
        const { id, number, date, purpose_title, purpose_description } = currentQueue.dataValues;
        queueRenderData.currentQueue.push({
          queueId: id,
          queueNumber: number,
          queuePurpose: purpose_title,
          queueDescription: purpose_description,
          queueDate: date
        });
      } else if (pendingQueues.length > 0) {
        const pendingQueue = pendingQueues[0];
        const { id, number, date, purpose_title, purpose_description } = pendingQueue.dataValues;
  
        await Queue.update(
          { status: 'Current' },
          { where: { id } }
        );
  
        queueRenderData.currentQueue.push({
          queueId: id,
          queueNumber: number,
          queuePurpose: purpose_title,
          queueDescription: purpose_description,
          queueDate: date
        });
      }
  
      pendingQueues.forEach(({ dataValues }) => {
        const { id, number, date, purpose_title, purpose_description } = dataValues;
        queueRenderData.pendingQueue.push({
          queueId: id,
          queueNumber: number,
          queuePurpose: purpose_title,
          queueDescription: purpose_description,
          queueDate: date
        });
      });
  
      res.render('main', queueRenderData);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  };
  

  exports.getViewPageRender = async (req, res) => {
    try {
      const [currentQueue, pendingQueues] = await Promise.all([
        Queue.findOne({
          where: {
            status: 'Current'
          }
        }),
        Queue.findAll({
          where: {
            status: 'Pending'
          },
          order: [['date', 'ASC']],
          limit: 12
        })
      ]);
  
      const queueRenderData = {
        currentQueue: [],
        pendingQueue: pendingQueues.map(({ dataValues }) => ({
          queueId: dataValues.id,
          queueNumber: dataValues.number,
          queuePurpose: dataValues.purpose_title,
          queueDescription: dataValues.purpose_description,
          queueDate: dataValues.date
        }))
      };
  
      if (currentQueue) {
        const { id, number, date, purpose_title, purpose_description } = currentQueue.dataValues;
        queueRenderData.currentQueue.push({
          queueId: id,
          queueNumber: number,
          queuePurpose: purpose_title,
          queueDescription: purpose_description,
          queueDate: date
        });
      }
  
      res.render('view', queueRenderData);
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  };
  

exports.finishCurrentQueue = async (req, res) => {
    const { queueID, nextQueueID } = req.body;
    
    try {
      await Queue.update(
        { status: 'Finished' },
        { where: { id: queueID } }
      );
  
      await Queue.update(
        { status: 'Current' },
        { where: { id: nextQueueID } }
      );
  
      res.json({ success: true });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  };

exports.registerAccount = async (req, res) => {
    const { fullName, username, password } = req.body

    try {
        bcrypt.hash(password, 10, async (error, hashedPassword) => {
            if(error) {
                throw error
            }
            await SystemUser.create({
                username: username,
                password: hashedPassword,
                display_name: fullName
            })
            res.json({success: true})
        })
        
    } catch(error) {
        res.status(500).send('Internal Server Error');
    }
}

exports.loginAccount = async (req, res) => {
    const { userName, password } = req.body;
    try {
      const user = await SystemUser.findOne({ where: { username: userName } });
      
      if (user) {
        const { display_name, password: storedPassword } = user;
        const isMatched = await bcrypt.compare(password, storedPassword);
  
        if (isMatched) {
          req.session.user = { ...user, isLoggedIn: true };
          res.json({ success: true });
        } else {
          res.json({ success: false });
        }
      } else {
        res.json({ success: false });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  };
  