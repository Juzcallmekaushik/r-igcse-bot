import {
	ChatInputCommandInteraction,
	ContextMenuCommandInteraction,
	Events,
	type Interaction,
} from "discord.js";
import BaseEvent from "../registry/Structure/BaseEvent";
import type { DiscordClient } from "../registry/DiscordClient";
import { logger } from "..";

export default class InteractionCreateEvent extends BaseEvent {
	constructor() {
		super(Events.InteractionCreate);
	}

	async execute(client: DiscordClient, interaction: Interaction) {
		if (interaction.isChatInputCommand())
			this.handleCommand(client, interaction);
		else if (interaction.isContextMenuCommand())
			this.handleMenu(client, interaction);
	}

	async handleCommand(
		client: DiscordClient,
		interaction: ChatInputCommandInteraction,
	) {
		const command = client.commands.get(interaction.commandName);

		if (!command) {
			logger.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(client, interaction);
		} catch (error) {
			logger.error(error);

			if (interaction.replied || interaction.deferred)
				await interaction.followUp({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			else
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
		}
	}
	async handleMenu(
		client: DiscordClient,
		interaction: ContextMenuCommandInteraction,
	) {
		const menu = client.menus.get(interaction.commandName);

		if (!menu) {
			logger.error(`No menu matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await menu.execute(client, interaction);
		} catch (error) {
			logger.error(error);

			if (interaction.replied || interaction.deferred)
				await interaction.followUp({
					content: "There was an error while executing this menu!",
					ephemeral: true,
				});
			else
				await interaction.reply({
					content: "There was an error while executing this menu!",
					ephemeral: true,
				});
		}
	}
}
