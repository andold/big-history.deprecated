import { createContext } from "react";
import { appendTimeStartAndEnd } from "./Utility";

export const OneContext = createContext({
	grid: {
		x: 64,	// fixed
		fx: 64,	// will be calulated by element by font.size
		max: {
			width: 128,
			height: 128 * 1024,
		},
		line: {
			height: 12	// will be calulated by element by font.size
		},
		element: null,	// will be initialized by font.size
	},
	font: {
		size: 12,	// user setting
	},
	root: null,	// root history
	position: {
		x: null,	//	will be initialized by grid.x
		y: null,	//	will be set by grid.line.height by element by font.size
	},
	map: new Map(), // {history: rectangle: {position, size}}
});

export function initializeOneContext(context: any, root: any) {
	if (!context || !root) {
		return;
	}
	context.root = root;
	context.grid.element = document.createElement("div");
	document.body.appendChild(context.grid.element);
	context.grid.element.style.fontSize = context.font.size + "px";
	context.grid.element.style.marginLeft = "-1024px";
	context.grid.element.style.position = "absolute";
	context.grid.element.style.paddingLeft = "0.5rem";
	context.grid.element.innerHTML = "BC 65 년";
	context.grid.line.height = context.grid.element.clientHeight + 1;
	context.grid.fx = Math.ceil((context.grid.element.clientWidth + 1) / context.grid.x) * context.grid.x;
	context.position.y = appendTimeStartAndEnd(new Map(), context.root);
	//	sort by time key
	const keys = Array.from(context.position.y.keys()).sort((a, b) => Number(a) - Number(b));
	//	y 위치 표시
	for (let cx = 0, sizex = keys.length; cx < sizex; cx++) {
		context.position.y.set(keys[cx], cx * context.grid.line.height * 3);
	}
	// x 위치 표시
	context.position.x = [];
	for (let cx = 0; cx < 64; cx++) {
		context.position.x.push(cx * context.grid.x);
	}
}

export function resetOneContextPosition(context: any) {
	context.position.y = appendTimeStartAndEnd(new Map(), context.root);
	//	sort by time key
	const keys = Array.from(context.position.y.keys()).sort((a, b) => Number(a) - Number(b));
	//	y 위치 표시
	for (let cx = 0, sizex = keys.length; cx < sizex; cx++) {
		context.position.y.set(keys[cx], cx * context.grid.line.height * 3);
	}
}
