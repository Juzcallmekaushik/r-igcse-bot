import {
	ContextMenuCommandBuilder,
	ContextMenuCommandInteraction,
} from "discord.js";
import type { DiscordClient } from "../DiscordClient";

export default abstract class BaseMenu {
	constructor(private _data: ContextMenuCommandBuilder) {}

	get data() {
		return this._data;
	}

	abstract execute(
		client: DiscordClient,
		interaction: ContextMenuCommandInteraction,
	): Promise<void>;
}
