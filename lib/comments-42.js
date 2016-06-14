'use babel';

import { CompositeDisposable } from 'atom';

export default {
	subscriptions: null,

	activate(state) {
		this.subscriptions = new CompositeDisposable();

		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'comments-42:comment': () => this.comment()
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	comment() {
		var arr;
		var start = /^\/\*$/;
		var end = /^\*\/$/;
		var isCommented = false;
		var editor = atom.workspace.getActiveTextEditor();
		var supportCComments = [
			"c",
			"cpp",
			"cs",
			"css",
			"h",
			"js",
			"untitled",
			"VHD",
			"VHDL"
		];

		if (editor) {
			if (supportCComments.indexOf(editor.getTitle().split(".").pop()) === -1) {
				atom.notifications.addWarning("This File does not support C comments");
				atom.beep();
				return ;
			}
			arr = editor.getSelectedText().split("\n");
			for (i = 0; i < arr.length; i++) {
				if (start.test(arr[i])) {
					for (i; i < arr.length; i++) {
						if (end.test(arr[i])) {
							isCommented = true;
							break ;
						}
					}
					if (isCommented) {
						break ;
					}
				}
			}
			if (isCommented) {
				arr = arr.filter(function(str) {
					return (!(start.test(str) || end.test(str)));
				});
				for (i = 0; i < arr.length; i++) {
					arr[i] = arr[i].replace(/\*\*[\. ]/, "");
				}
			} else {
				arr.unshift("/*");
				for (i = 1; i < arr.length; i++) {
					if (arr[i] === "") {
						arr[i] = ".";
					} else {
						arr[i] = " " + arr[i];
					}
					arr[i] = "**" + arr[i];
				}
				arr.push("*/");
			}
			editor.insertText(arr.join("\n"));
		}
	}
};
