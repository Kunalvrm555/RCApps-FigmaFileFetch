import { IAppAccessors, IConfigurationExtend, ILogger } from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { FigmaCommand } from './commands/FigmaCommand';

export class FigmaAppApp extends App {
	constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
		super(info, logger, accessors);
	}
    
	protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
		const figmaCommand: FigmaCommand = new FigmaCommand();
		await configuration.slashCommands.provideSlashCommand(figmaCommand);
        
	}
    
}
