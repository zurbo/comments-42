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
		var arr, index;
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
			for (i = 0; i < arr.length && !isCommented; i++) {
				if (/^\/\*$/.test(arr[i])) {
					for (i; i < arr.length; i++) {
						if (/^\*\/$/.test(arr[i])) {
							isCommented = true;
							break ;
						}
					}
				}
			}
			if (isCommented) {
				arr = arr.filter(function(str) {
					return (!(/^\/\*$/.test(str) || /^\*\/$/.test(str)));
				});
				for (i = 0; i < arr.length; i++) {
					arr[i] = arr[i].replace(/^\*\*/, "");
					arr[i] = arr[i].replace(/^[ \.]/, "");
				}
			} else {
				arr.unshift("/*");
				for (i = 1; i < arr.length; i++) {
					arr[i] = arr[i].trim();
					if (arr[i] === "") {
						arr[i] = ".";
					} else if (arr[i].length + 3 > 80 && arr[i].length <= 80) {
						index = arr[i].search(/[ \t][^ \t]*$/);
						if (index > 0) {
							arr.splice(i + 1, 0, arr[i].substring(index));
							arr[i] = arr[i].substring(0, index);
							if (arr[i].length + 3 > 80) {
								index = arr[i].search(/[ \t][^ \t]*$/);
								if (index > 0) {
									arr[i + 1] = arr[i].substring(index) + arr[i + 1];
									arr[i] = arr[i].substring(0, index);
								}
							}
						}
						arr[i + 1] = "<" + arr[i + 1];
						arr[i] = " " + arr[i];
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
