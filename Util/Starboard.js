const { ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js")
const { starBoardCha } = require("../config.json")

async function StarboardAdd(reaction) {
  if (reaction.emoji.name !== "⭐") return;
  const message = reaction.message
  let rcount = reaction.count
  const db = reaction.client.db.Star

  if (reaction.users.cache.has(message.author.id)) rcount--

  const dbData = await db.findOne({ where: { messageId: message.id } })

  if (rcount >= 5 && !dbData) {
    const starEmbed = createEmbed(message)
    const button = createButton(message.url)

    reaction.client.channels.cache.get(starBoardCha).send({ content: `⭐ **${rcount}** | <#${message.channel.id}>`, embeds: [starEmbed], components: [button] })
      .then(async ownmessage => {
        await db.create({
          messageId: message.id,
          messageIdBot: ownmessage.id
        })
      })
      .catch(console.error)
  }
  else if (dbData) {
    const starEmbed = createEmbed(message)
    const button = createButton(message.url)

    reaction.client.channels.cache.get(starBoardCha).messages.fetch(dbData.messageIdBot)
      .then((e) => {
        e.edit({ content: `⭐ **${rcount}** | <#${message.channel.id}>`, embeds: [starEmbed], components: [button] })
      })
  }
}

async function StarboardRemove(reaction) {
  const message = reaction.message
  let rcount = reaction.count
  const db = reaction.client.db.Star

  if (reaction.users.cache.has(message.author.id)) rcount -= 1

  const dbData = await db.findOne({ where: { messageId: message.id } })
  if (!dbData) return

  const starEmbed = createEmbed(message)
  const button = createButton(message.url)

  reaction.client.channels.cache.get(starBoardCha).messages.fetch(dbData.messageIdBot)
    .then(e => {
      e.edit({ content: `⭐ **${rcount}**  | <#${message.channel.id}>`, embeds: [starEmbed], components: [button] })
    })

}

function createEmbed(message) {
  const avatar = message.author.avatarURL({ extension: "png", size: 4096 })

  const embed = new EmbedBuilder()
    .setAuthor({ name: message.author.tag, iconURL: typeof avatar === "string" ? avatar : undefined })
    .setColor(Math.floor(Math.random() * 16777215).toString(16))
    .setTimestamp(new Date());

  let yesnt = true

  message.embeds.forEach(e => {
    if (e.description && yesnt) { embed.setDescription(e.description); yesnt = false }
  })

  if (message.content) embed.setDescription(message.content)
  if (message.attachments.size) embed.setImage(message.attachments.first().url)

  return embed
}

function createButton(url) {
  return new ActionRowBuilder()
    .addComponents(new ButtonBuilder()
      .setLabel("Original Message")
      .setStyle("Link")
      .setURL(url)
    )
}

module.exports = { StarboardAdd, StarboardRemove }