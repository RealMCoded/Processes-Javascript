const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageAttachment } = require('discord.js')
const { CreateAndWrite, ReadFile } = require('../Util/someFun')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription("Get something")
    .addStringOption(o => o
      .setName('what')
      .setDescription("What do you want to get?")
      .addChoices({ name: 'Role Icon', value: 'ri' }, { name: 'Role Color', value: 'rc' })
      .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply()
    const choice = interaction.options.getString("what")
    const guildRole = await interaction.guild.roles.fetch()

    if (choice === "ri") {
      let ArrayURL = []
      guildRole.forEach(e => {
        if (e.iconURL()) {
          let icon = e.iconURL({ format: 'png', size: 4096 })
          let name = e.name
          ArrayURL.push(`${icon} for ${name}\n`)
        }
      });

      if (ArrayURL) {
        CreateAndWrite('/Tmp/log.txt', ArrayURL)
        interaction.followUp({files: [new MessageAttachment(ReadFile('/Tmp/log.txt'))]})
      }
      else if (!ArrayURL) {
        interaction.followUp("There is no role with an icon")
      }
    }
    else if (choice === 'rc') {
      let ArrColor = []
      
      guildRole.forEach(e => {
        let color = e.hexColor
        let name = e.name
        if (color !== '#000000') ArrColor.push(`${color} for ${name}\n`)
      })
      if (ArrColor) {
        CreateAndWrite('/Tmp/log.txt', ArrColor)
        interaction.followUp({ files: [new MessageAttachment(ReadFile('/Tmp/log.txt'))]})
      }
      else if (!ArrColor) {
        interaction.followUp("No role have color")
      }
    }
  }
}