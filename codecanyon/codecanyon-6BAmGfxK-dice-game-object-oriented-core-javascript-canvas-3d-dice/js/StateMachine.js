/****GameUI.js*****/
var StateMachine = {
	states: {
		initScreen: true,
		mainMenu: false,
		gameplay: false,
		settings: false,
		finalScreen: false,
		payTable: false
	},
	getState: function () {
		var t = this;
		var keys = Object.keys(t.states);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			if (t.states[key] == true) {
				return key;
			}
		}
	},
	setState: function (oldState, newState) {
		var t = this;
		t.states[oldState] = false;
		t.states[newState] = true;
	}
};