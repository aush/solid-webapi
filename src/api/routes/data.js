module.exports = (actions) => [{
  method: 'get',
  auth: '',
  path: '/data',
  handler: (req, res) => {
    actions.getData().then(result => { res.json(result); });
  },
}, {
  method: 'get',
  auth: '',
  path: '/data/:content',
  handler: (req, res) => {
    actions.getData({ content: req.params.content }).then(result => { res.json(result); });
  },
}, {
  method: 'post',
  auth: 'jwt',
  path: '/data/:content',
  handler: (req, res) => {
    actions.addData({ content: req.params.content }).then(() => { res.sendStatus(200); });
  },
}];
