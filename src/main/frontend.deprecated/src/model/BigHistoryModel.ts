// BigHistoryModel.ts
export default interface BigHistory {
	id: number;
	title: string;
	description: string;
	category: string;
	start: number;
	end: number;
	created: string;
	updated: string;

	// deprecated
	collapsed: boolean;

	children: BigHistory[] | null;

	// not support field. user custom.
	custom: any;
}

export interface BigHistoryForm {
	start: number;
	end: number;
	width: number;
	height: number;
	margin: number;
	
	mode: number;
}

export interface Position {
	x: number;
	y: number;
}
export interface Size {
	width: number;
	height: number;
}
export interface Rectangle extends Position, Size {
}
