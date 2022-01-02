const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: '💸 Currency',
  id: 'currency',
  desc: "Useful commands to earn and use money!"
}