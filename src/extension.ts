import * as vscode from 'vscode';

const CONFIG_SECTION = 'hideLogs';
const CONFIG_DEFAULT_ENABLED = 'defaultEnabled';
const CONFIG_CLEAN_START = 'cleanStart';
const CONFIG_TOKENS = 'tokenColorCustomizations';

const trigger = async (enabled: boolean) => {
	await vscode.commands.executeCommand(
		'setContext',
		'hideLogsEnabled',
		enabled
	);

	// Folding
	// if (!enabled) {
	// 	await vscode.commands.executeCommand('editor.foldAllBlockComments');
	// } else {
	// 	await vscode.commands.executeCommand('editor.unfoldAll');
	// }
};

export async function activate({ subscriptions }: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('editor');
	const colors = config.get<any>(CONFIG_TOKENS);

	const extConfig = vscode.workspace.getConfiguration(CONFIG_SECTION);
	const extDefaultEnabled = extConfig.get<boolean>(CONFIG_DEFAULT_ENABLED);
	const extCleanStart = extConfig.get<boolean>(CONFIG_CLEAN_START);

	const setLogs = async (enabled: boolean) => {
		console.log('FJL: set logs entered');
		if (config && colors) {
			console.log('FJL: set logs if');
			let textMateRules: any[] = colors['textMateRules'] || [];
			let commentRuleIdx = textMateRules.findIndex(
				r => r && r.scope && (r.scope as any[]).includes('cpdebug.clog')
			);

			if (enabled) {
				colors['comments'] = '#00000000';

				if (commentRuleIdx >= 0) {
					textMateRules[commentRuleIdx].settings.foreground = '#00000000';
				} else {
					textMateRules.push({
						scope: [
							'cpdebug',
							'cpdebug.clog',
							'cpdebug.arraydb',
							'cpdebug.indentdb',
						],
						settings: {
							foreground: '#00000000',
						},
					});
				}
			} else {
				colors['comments'] = '';

				if (commentRuleIdx >= 0) {
					textMateRules = textMateRules.filter(
						r => r && r.scope && !(r.scope as any[]).includes('cpdebug.clog')
					);
				}
			}

			colors['textMateRules'] = textMateRules;

			await config.update(CONFIG_TOKENS, colors);

			trigger(colors && !colors['comments']);
		}
	};

	// Automatically start when the comments setting is not available
	if (extDefaultEnabled && config && colors && !colors['comments']) {
		const choice = await vscode.window.showInformationMessage(
			'Do you want to hide comments in this project?',
			'Yes',
			'No'
		);
		if (choice === 'Yes') {
			setLogs(true);
		} else {
			setLogs(false);
		}
	}

	if (extCleanStart && config && colors && colors['comments']) {
		setLogs(false);
	}

	const hideLogsCmd = vscode.commands.registerCommand('hideLogs.hide', () => {
		console.log('FJL: hide logs triggerred');
		vscode.window.showInformationMessage('hide logs command triggered');
		setLogs(true);
	});

	const showLogsCmd = vscode.commands.registerCommand('hideLogs.show', () => {
		vscode.window.showInformationMessage('show logs command triggered');
		setLogs(false);
	});

	// Set the type of action to show on the menu
	trigger(colors && !colors['comments']);

	subscriptions.push(hideLogsCmd);
	subscriptions.push(showLogsCmd);
}

// this method is called when your extension is deactivated
export function deactivate() {}
