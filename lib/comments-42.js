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
		var start = /^\/\*$/;
		var end = /^\*\/$/;
		var isCommented = false;
		var arr = [];
		var editor = atom.workspace.getActiveTextEditor();

		if (editor) {
			arr = editor.getSelectedText().split("\n");
			for (var i = 0; i < arr.length; i++) {
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
				for (var i = 0; i < arr.length; i++) {
					arr[i] = arr[i].replace(/\*\*[\. ]/, "");
				}
			} else {
				arr.unshift("/*");
				for (var i = 1; i < arr.length; i++) {
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
