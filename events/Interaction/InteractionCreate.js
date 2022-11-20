const { InteractionType, codeBlock } = require("discord.js");

module.exports = {
  name: 'interactionCreate',
  on: true,
  async execute(interaction) {
    if (interaction.partial) return;
    
    if (interaction.type == InteractionType.ApplicationCommand) {
      if (interaction.commandType == 1) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction).catch(async err => {
          console.error(err)
          await interaction.reply({ content: `There was an error while executing this command!\n\`\`\`${err} \`\`\``, ephemeral: true }).catch(await interaction.followUp({ content: `There was an error while executing this command!\n\`\`\` ${err} \`\`\``, ephemeral: true }).catch(e => { interaction.editReply({ content: `There was an error while executing this command!\n\`\`\` ${err} \`\`\``, ephemeral: true }).catch(e => { }) }));
        });
      }
      else if (interaction.commandType == 2 || interaction.commandType == 3) {
        const contextMenu = client.contextMenu.get(interaction.commandName);
        if (!contextMenu) return;

        await contextMenu.execute(interaction).catch(async err => {
          console.error(err)
          await interaction.reply({ content: `There was an error while executing this context menu!\n\`\`\`${err} \`\`\``, ephemeral: true }).catch(await interaction.followUp({ content: `There was an error while executing this context menu!\n\`\`\` ${err} \`\`\``, ephemeral: true }).catch(e => { interaction.editReply({ content: `There was an error while executing this context menu!\n\`\`\` ${err} \`\`\``, ephemeral: true }).catch(e => { }) }));
        });
      }
    }
    else if (interaction.type == InteractionType.MessageComponent) {
      if (interaction.isSelectMenu) {
        if (interaction.customId !== "role-selector") return;
        await interaction.deferReply({ ephemeral: true })
        let arr = []
        interaction.values.forEach(roleId => {
          arr.push(interaction.guild.roles.fetch(roleId))
        })
        arr = await Promise.all(await interaction.member.fetch(), arr).catch(e => {});arr.slice(1)
        
        const roles = interaction.member.roles;

        let response = []
        arr.forEach(async role => {
          if (role) {
            if (roles.cache.has(role.id)) {
              await roles.remove(role)
              response.push(`- ${role.name}`)
            }
            else if (!roles.cache.has(role.id)) {
              await roles.add(role)
              response.push(`+ ${role.name}`)
            }
          }
          else if (!role) {
            console.log(`${role.id} doesn't exist`)
          }
          
          interaction.followUp(`${codeBlock("diff", response.join("\n"))}`)
        });
      }
    }
    else if (interaction.isModalSubmit) {
      if (!interaction.customId.startsWith("edit-message")) return

    }
  }
}