import {
	IHttp,
	IHttpRequest,
	IHttpResponse,
	IMessageBuilder,
	IModify,
	IModifyCreator,
	IPersistence,
	IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IMessage } from '@rocket.chat/apps-engine/definition/messages';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands/index';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
const FIGMA_TOKEN = '359404-ba3cbd45-311b-4549-babc-b1347d38a592';
const fileId = 'FEYljnlYGnWZPkJaim4zxi';
import { ImageAttachment } from '../lib/ImageAttach';
export class FigmaCommand implements ISlashCommand {
	public command = 'figma';
	public i18nDescription = 'Fetch thumbnails of Figma components in file using fileId';
	public providesPreview = false;
	public i18nParamsExample = '';
	public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp, persis: IPersistence): Promise<void> {
		// const fileId = context.getArguments();
		const fileId = 'oswJXeOp3Vig69Q2kV3nFc';
		const Response = await http.get('https://api.figma.com/v1/files/' + fileId, {
			headers: {
				'X-Figma-Token': FIGMA_TOKEN,
			},
		});

		const sender = context.getSender();
		const room = context.getRoom();

		async function figmaFileFetch(fileId) {
			const figmaFileStruct = Response.data;
			const figmaFrames = figmaFileStruct.document.children
				.filter((child) => child.type === 'CANVAS')[0]
				.children.filter((child: { type: string }) => child.type === 'FRAME')

				.map((frame) => {
					return {
						name: frame.name,
						id: frame.id,
					};
				});
			const ids = figmaFrames.map((comp: { id: any }) => comp.id).join(',');
			console.log(ids);
			const Response2 = await http.get('https://api.figma.com/v1/images/' + fileId + '?ids=' + ids, {
				headers: { 'X-Figma-Token': FIGMA_TOKEN },
			});
			const figmaImages = Response2.data.images;
			console.log(JSON.stringify(figmaImages));

			return figmaFrames.map((frame) => {
				return {
					name: frame.name,
					url: figmaImages[frame.id],
				};
			});
		}
		const images = await figmaFileFetch(fileId);
		for (let image of images) {
			const message = modify
				.getCreator()
				.startMessage()
				.setRoom(room)
				.setText(`*${image.name}*`)
				.addAttachment(new ImageAttachment(image.url));
			await modify.getCreator().finish(message);
		}
	}
}
export default FigmaCommand;
