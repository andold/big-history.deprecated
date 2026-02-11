const ONE_SOLAR_YEAR = 31556926.08;
const UNIVERSE_AGE = 13799000000.0 * ONE_SOLAR_YEAR;

export const addToMap = (map: any, history: any) => {
	let defaultItem = {
		starters: []
		, alumni: []
		, reside: []
	};
	if (!history) {
		return;
	}

	let item = map.get(history.start);
	if (!item) {
		item = JSON.parse(JSON.stringify(defaultItem));
		map.set(history.start, item);
	}

	item.starters.push(history);
	
	item = map.get(history.end);
	if (!item) {
		item = JSON.parse(JSON.stringify(defaultItem));
		map.set(history.end, item);
	}

	if (!history.children || !history.children.length) {
		return;
	}

	for (let cx = 0, sizex = history.children.length; cx < sizex; cx++) {
		addToMap(map, history.children[cx]);
	}
};
export function appendTimeStartAndEnd(map: any, history: any) {
	map.set(history.start, map.get(history.start) ? map.get(history.start) + 1 : 1);
	map.set(history.end, map.get(history.end) ? map.get(history.end) + 1 : 1);
	if (!history.children || !history.children.length || history.collapsed) {
		return map;
	}
	for (let cx = 0; cx < history.children.length; cx++) {
		appendTimeStartAndEnd(map, history.children[cx]);
	}
	return map;
}
export function clone(object: any): any {
	return JSON.parse(JSON.stringify(object));
}
export const formatString = (...args: any) => {
	let formatted = "";
	for( let arg in args ) {
		formatted = formatted.concat(args[arg]);
	}
	return formatted;
};
export const toHtmlDuration = (duration: any) => {
	const ONE_SOLAR_YEAR = 31556926.08;

	if (duration === 0) {
		return "0";
	}
	
	if (duration < ONE_SOLAR_YEAR) {	//	1년
		return formatString(duration.toExponential(0), " 초");
	}

	if (duration < ONE_SOLAR_YEAR * Math.pow(10, 4)) {	//	1만년
		return formatString(Math.round(duration / ONE_SOLAR_YEAR), " 년");
	}

	if (duration < ONE_SOLAR_YEAR * Math.pow(10, 8)) {	//	빅뱅후 1억년
		return formatString(Math.round(duration / ONE_SOLAR_YEAR / Math.pow(10, 4)), " 만년");
	}

	if (duration < ONE_SOLAR_YEAR * Math.pow(10, 12)) {	//	빅뱅후 1조년
		return formatString(Math.round(duration / ONE_SOLAR_YEAR / Math.pow(10, 8)), " 억년");
	}

	return formatString(Math.round(duration / ONE_SOLAR_YEAR).toExponential(0), " 년");
};
export const getTextTime = (time: any) => {
	if (time == null) {
		return "";
	}

	if (time < ONE_SOLAR_YEAR * 7000000000.0) {	//	빅뱅후 70억년
		return toHtmlDuration(time);
	}

	if (time < UNIVERSE_AGE) {	//	기원전
		let bc = UNIVERSE_AGE - time;
		if (bc < ONE_SOLAR_YEAR * Math.pow(10, 4)) {	//	기원전 1만년
			return formatString("BC ", toHtmlDuration(bc));
		}

		return formatString(toHtmlDuration(bc), "전");
	}

	//	기원후
	let ad = time - UNIVERSE_AGE;
	if (ad < ONE_SOLAR_YEAR * Math.pow(10, 8)) {	//	기원후 1억년
		return formatString("AD ", toHtmlDuration(ad));
	}

	return formatString(toHtmlDuration(ad), "후");
};
