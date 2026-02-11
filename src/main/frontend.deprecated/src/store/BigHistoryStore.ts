import { makeAutoObservable } from "mobx";
import moment from "moment";

import repository from "../repository/BigHistoryRepository";

const cellStyleLeft = { textAlign: "left", padding: 1, };
const cellStyleRight = { textAlign: "right", padding: 1, paddingRight: 4, };
const cellStyleCenter = { textAlign: "center", padding: 1, };

export const ONE_SOLAR_YEAR = 31556926.08;	//	1년, 초
export const UNIVERSE_AGE = 13799000000.0 * ONE_SOLAR_YEAR;	// AD
const rem = 16;
export const TIME_LINE: any[] = [
	[0 * Math.pow(10, 0) * ONE_SOLAR_YEAR, 0, 0, rem, 0],	//	0초
	[1 * Math.pow(10, 0) * ONE_SOLAR_YEAR, 0, 8, rem, 50],	//	1초
	[1 * Math.pow(10, 8) * ONE_SOLAR_YEAR, Math.pow(10, 8) * ONE_SOLAR_YEAR, 8, -0, 16],	//	1억년

	[70 * Math.pow(10, 8) * ONE_SOLAR_YEAR, Math.pow(10, 8) * ONE_SOLAR_YEAR, 8, -0, 16],	//	빅뱅후 70억년

	[UNIVERSE_AGE - 50 * Math.pow(10, 8) * ONE_SOLAR_YEAR, Math.pow(10, 8) * ONE_SOLAR_YEAR, 2, -0, -0],	//	태양계
	[UNIVERSE_AGE - 5.42 * Math.pow(10, 8) * ONE_SOLAR_YEAR, Math.pow(10, 7) * ONE_SOLAR_YEAR, 2, -0, -0],	//	현생누대
	[UNIVERSE_AGE - 6600 * Math.pow(10, 4) * ONE_SOLAR_YEAR, Math.pow(10, 6) * ONE_SOLAR_YEAR, 1, -0, -0],	//	신생대
	[UNIVERSE_AGE - 1 * Math.pow(10, 4) * ONE_SOLAR_YEAR, Math.pow(10, 6) * ONE_SOLAR_YEAR, 1, -0, -0],	//	기원전 1만년
	[UNIVERSE_AGE - 2000 * ONE_SOLAR_YEAR, Math.pow(10, 5) * ONE_SOLAR_YEAR, 1, -0, -0],	//	고조선
	[UNIVERSE_AGE - 700 * ONE_SOLAR_YEAR, Math.pow(10, 5) * ONE_SOLAR_YEAR, 2, -0, -0],	//	탈레스
	[UNIVERSE_AGE, 2, -0, -0],	//	기원전후
	[UNIVERSE_AGE + 1392 * ONE_SOLAR_YEAR, Math.pow(10, 1) * ONE_SOLAR_YEAR, 10, -0, -0],	//	조선
	[UNIVERSE_AGE + 2050 * ONE_SOLAR_YEAR, ONE_SOLAR_YEAR, 2, -0, -0],	//	2050년

	[UNIVERSE_AGE + Math.pow(10, 200) * ONE_SOLAR_YEAR, -0, 4, -0, -0],	//	암흑 시대
];
// BigHistoryStore.ts
class BigHistoryStore {
	constructor() {
		makeAutoObservable(this);
	}

	root(request?: any, onSuccess?: any, onError?: any, element?: any) {
		repository.root(request, onSuccess, onError, element);
	}
	search(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.search(request, onSuccess, onError, element);
	}
	download(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.download(request, onSuccess, onError, element);
	}
	update(request: any, onSuccess?: any, onError?: any, element?: any) {
		repository.update(request, onSuccess, onError, element);
	}


	//	utils
	times(index: number): any {
		if (Number.isSafeInteger(index)) {
			return TIME_LINE[index];
		}
		return TIME_LINE;
	}
	possible(significant: number, figure: number): number | null {
		if (Math.round(significant) * Math.pow(10, figure) === Math.round(significant * Math.pow(10, figure))) {
			return Math.round(significant);
		}

		return null;
	}
	significant(significant: number): string {
		const possibleLong = this.possible(significant, 4);
		if (possibleLong == null) {
			return significant.toPrecision(3);
		}
		
		return possibleLong.toFixed();
	}
	duration(duration: number): string {
		if (duration === 0) {
			return "0";
		}
		
		if (duration < 1) {	//	빅뱅후 1초
			const exponent = Math.log10(duration);
			const significant = duration / Math.pow(10, exponent);
			if  (significant === 1) {
				return `10E${exponent} 초`;
			}

			return `${this.significant(significant)} x 10E${exponent} 초`;
		}

		if (duration < ONE_SOLAR_YEAR) {	//	1년
			return `${this.significant(duration)} 초`;
		}

		if (duration < ONE_SOLAR_YEAR * Math.pow(10, 4)) {	//	1만년
			return `${this.significant(duration / ONE_SOLAR_YEAR)} 년`;
		}

		if (duration < ONE_SOLAR_YEAR * Math.pow(10, 8)) {	//	빅뱅후 1억년
			return `${this.significant(duration / ONE_SOLAR_YEAR / Math.pow(10, 4))} 만년`;
		}

		if (duration < ONE_SOLAR_YEAR * Math.pow(10, 12)) {	//	빅뱅후 1조년
			return `${this.significant(duration / ONE_SOLAR_YEAR / Math.pow(10, 8))} 억년`;
		}

		const exponent = Math.log10(duration / ONE_SOLAR_YEAR);
		const significant = duration / ONE_SOLAR_YEAR / Math.pow(10, exponent);
		if  (significant === 1) {
			return `10E${exponent} 초`;
		}

		return `${this.significant(significant)} x 10E${exponent} 년`;
	}
	format(time: number): string {
		if (time < ONE_SOLAR_YEAR * 7000000000.0) {	//	빅뱅후 70억년
			return this.duration(time);
		}

		if (time < UNIVERSE_AGE) {	//	기원전
			const bc = UNIVERSE_AGE - time;
			if (bc < ONE_SOLAR_YEAR * Math.pow(10, 4)) {	//	기원전 1만년
				return `BC ${this.duration(bc)}`;
			}

			return `${this.duration(bc)}전`;
		}

		//	기원후
		const ad = time - UNIVERSE_AGE;
		if (ad < ONE_SOLAR_YEAR * Math.pow(10, 8)) {	//	기원후 1억년
			return `AD ${this.duration(ad)}`;
		}

		return `${this.duration(ad)}`;
	}
	calculateX(x: number, start: number, end: number, width: number): number {
		return (x - start) / (end - start) * width;
	}
	columnDefs(hides?: string[]): any {
		return [{
			field: "id",
			hide: hides && hides.includes("id"),
			editable: false,
			cellStyle: cellStyleRight,
			width: 32,
			rowDrag: true,
		}, {
			field: "parentId",
			hide: hides && hides.includes("parentId"),
			editable: false,
			cellStyle: cellStyleRight,
			width: 32,
		}, {
			field: "collapsed",
			hide: hides && hides.includes("collapsed"),
			cellStyle: cellStyleLeft,
			width: 32,
		}, {
			field: "title",
			hide: hides && hides.includes("title"),
			cellStyle: cellStyleLeft,
			width: 64,
			flex: 2,
		}, {
			field: "category",
			hide: hides && hides.includes("category"),
			cellStyle: cellStyleLeft,
			width: 64,
			flex: 2,
		}, {
			field: "description",
			hide: hides && hides.includes("description"),
			cellStyle: cellStyleLeft,
			width: 128,
			flex: 2,
		}, {
			field: "start",
			hide: hides && hides.includes("start"),
			valueFormatter: (params: any) => this.format(params.value),
			editable: false,
			cellStyle: cellStyleRight,
			width: 64,
		}, {
			field: "end",
			hide: hides && hides.includes("end"),
			valueFormatter: (params: any) => this.format(params.value),
			editable: false,
			cellStyle: cellStyleRight,
			width: 64,
		}, {
			field: "created",
			hide: hides && hides.includes("created"),
			editable: false,
			valueFormatter: (params: any) => moment(params.value).format("YYYY-MM-DD"),
			width: 32,
			cellStyle: cellStyleCenter,
			flex: 1,
		}, {
			field: "updated",
			hide: hides && hides.includes("updated"),
			editable: false,
			valueFormatter: (params: any) => moment(params.value).format("YYYY-MM-DD"),
			width: 32,
			cellStyle: cellStyleCenter,
			flex: 1,
		}];
	}
}
const bigHistoryStore = new BigHistoryStore();
export default bigHistoryStore;
