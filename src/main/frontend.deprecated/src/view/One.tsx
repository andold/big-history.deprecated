import React, { useContext, useRef, useState } from "react";
import { OneContext, resetOneContextPosition } from "./OneContext";
import { OneTitle } from "./OneTitle";
import { clone } from "./Utility";
import BigHistory from "../model/BigHistoryModel";

export function One(props: any) {
	// properties
	const history: BigHistory = props.history;
	const propagate = props.onChangeSize;

	const context = useContext(OneContext);
	const [state, setState] = useState<any>({});
	const rendered = useRef(0);
	const rectangle = useRef<any>({
		position: {
			x: 0,
			y: 0,
		},
	});

	const hasNoChild = !history.children || !history.children.length;
	rectangle.current = context.map.get(history);
	if (!rectangle.current) {
		rectangle.current = calculateSize(history, context);
	}

	function onChangeSize() {
		const previous = clone(rectangle.current);
		resetOneContextPosition(context);
		const rect = calculateSize(history, context);
		if (previous.size.width === rect.size.width && previous.size.height === rect.size.height) {
			setState({...state});
			return;
		}
		const newRectangle = clone({...rect, position: previous.position});
		context.map.set(history, newRectangle);
		rectangle.current = newRectangle;
		setState({...state});
		propagate(history, newRectangle.size);
	}
	function onToggle() {
		history.collapsed = !history.collapsed;
		fetch("./api/big-history/" + history.id, {
		        method: "PUT",
		        headers: { "Content-Type": "application/json" },
		        body: JSON.stringify({
		        	collapsed: history.collapsed,
		        }),
	        });
		const previous = clone(rectangle.current);
		const rect = calculateSize(history, context);
		if (previous.size.width === rect.size.width && previous.size.height === rect.size.height) {
			setState({...state});
			return;
		}
		const newRectangle = clone({...rect, position: previous.position});
		context.map.set(history, newRectangle);
		rectangle.current = newRectangle;
		setState({...state});
		propagate(history, newRectangle.size);
	}

	rendered.current++;
	if (hasNoChild) {
		return (
			<OneTitle
				history = {history}
				rectangle = {rectangle.current}
				onChangeSize = { onChangeSize }
				collapsed = {history.collapsed}
			/>
		);
	}
	if (history.collapsed) {
		return (
			<div className="position-absolute bg-success shadow-sm bg-opacity-10 border-secondary rounded-2"
				title = {history.title}
				style={{
					left: rectangle.current.position.x,
					top: rectangle.current.position.y,
					width: rectangle.current.size.width,
					height: rectangle.current.size.height,
				}}>
				<div className="position-absolute" style={{
					left: 0,
					top: 0,
					width: context.grid.fx,
					height: rectangle.current.size.height,
				}}>
					<OneTitle
						history = {history}
						rectangle = {{
							writingModeVertical: true,
							position: {
								x: 0,
								y: 0,
							},
							size: {
								width: context.grid.fx,
								height: rectangle.current.size.height,
							},
						}}
						onChangeSize = { onChangeSize }
						onToggle = { onToggle }
						collapsed = {history.collapsed}
					/>
				</div>
			</div>
		);
	}
	const items: any[] = [];
	for (let cx = 0, sizex = history.children!.length; cx < sizex; cx++) {
		const child: BigHistory = history.children![cx];
		const rectangle = context.map.get(child);
		items.push(
			<One key={child!.id}
				history={child}
				rectangle={rectangle.current}
				onChangeSize={onChangeSize}
			/>
		);
	}
	return (
		<div className="position-absolute bg-success shadow-sm bg-opacity-10 border-secondary rounded-2"
			title = {history.title}
			style={{
				left: rectangle.current.position.x,
				top: rectangle.current.position.y,
				width: rectangle.current.size.width,
				height: rectangle.current.size.height,
			}}>
			<div className="position-absolute" style={{
				left: 0,
				top: 0,
				width: context.grid.fx,
				height: rectangle.current.size.height,
			}}>
				<OneTitle
					history = {history}
					rectangle = {{
						writingModeVertical: true,
						position: {
							x: 0,
							y: 0,
						},
						size: {
							width: context.grid.fx,
							height: rectangle.current.size.height,
						},
					}}
					onChangeSize = { onChangeSize }
					onToggle = { onToggle }
					collapsed = {history.collapsed}
				/>
			</div>
			<div className="position-absolute" style={{
				left: context.grid.fx,
				top: 0,
				width: rectangle.current.size.width - context.grid.fx,
				height: rectangle.current.size.height,
			}}>
				{items}
			</div>
		</div>
	);
};
export function calculateSize(history: any, context: any): any {
	if (!history || !context) {
		return { };
	}
	const isEvent = history.start === history.end;
	const hasNoChild = !history.children || !history.children.length;
	const top = context.position.y.get(history.start);
	context.grid.element.innerHTML = history.title + "3,";
	const titleTextWidth = context.grid.element.clientWidth + 1;
	if (hasNoChild) {
		// 크기 계산
		const size = {
			width: Math.ceil(titleTextWidth / context.grid.x) * context.grid.x,
			height: context.position.y.get(history.end) - top,
		};
		let writingModeVertical = false;
		if (isEvent) {
			//	이벤트인 경우,
			if (titleTextWidth < context.grid.max.width) {
				// 크지 않으면, 2줄 높이
				size.height = context.grid.line.height * 2;
			} else {
				// 너무 크면 일정 너비로 여러줄
				size.width = context.grid.max.width;
				size.height = (titleTextWidth / context.grid.max.width + 2) * context.grid.line.height;
			}
		} else if (titleTextWidth < size.height) {
			// 세로가 충분히 길면, 세로로 쓴다.
			writingModeVertical = true;
			size.width = context.grid.fx;
		} else if (titleTextWidth > context.grid.max.width) {
			// 이벤트가 아니고 너무 크면
			let requireHeight = (titleTextWidth / context.grid.max.width + 3) * context.grid.line.height;
			if (requireHeight < size.height) {
				size.width = context.grid.max.width;
			}
		}
		
		return {
			writingModeVertical: writingModeVertical,
			size: size,
		};
	}

	if(history.collapsed) {
		return {
			writingModeVertical: true,
			size: {
				width: context.grid.fx,
				height: context.position.y.get(history.end) - top,
			},
		};
	}
	const rectanglesForChildren: any[] = [];
	for (let cx = 0, sizex = history.children.length; cx < sizex; cx++) {
		let child = history.children[cx];
		let rect = calculateSize(child, context);
		let position = calculatePosition(context.position.y.get(child.start) - top, rect.size, rectanglesForChildren, context.position.x);
		rect = {...rect, position: position};
		context.map.set(child, clone(rect));

		const isEvent = child.start === child.end;
		if (isEvent) {
			rect.size.height = 1;
		}
		rectanglesForChildren.push(clone(rect));
	}

	const rectangleChildren = union(rectanglesForChildren);
	return {
		writingModeVertical: true,
		size: {
			width: rectangleChildren.size.width + context.grid.fx,
			height: Math.max(context.position.y.get(history.end) - top, rectangleChildren.position.y + rectangleChildren.size.height),
		},
	};
}
function union(rectangles: any) {
	if (!rectangles || !rectangles.length) {
		return {
			position: {
				x: 0,
				y: 0,
			},
			size: {
				width: 0,
				height: 0,
			}
		};
	}
	let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity;
	for (let cx = 0, sizex = rectangles.length; cx < sizex; cx++) {
		left = Math.min(left, rectangles[cx].position.x);
		top = Math.min(top, rectangles[cx].position.y);
		right = Math.max(right, rectangles[cx].position.x + rectangles[cx].size.width);
		bottom = Math.max(bottom, rectangles[cx].position.y + rectangles[cx].size.height);
	}
	
	return {
		position: {
			x: left,
			y: top,
		},
		size: {
			width: right - left,
			height: bottom - top,
		}
	};
}
function intersect(rectangle: any, rectangles: any) {
	if (!rectangle || !rectangles) {
		return true;
	}
	for (let cx = 0; cx < rectangles.length; cx++) {
		if (rectangle.position.x >= rectangles[cx].position.x + rectangles[cx].size.width
				|| rectangles[cx].position.x >= rectangle.position.x + rectangle.size.width
				|| rectangle.position.y >= rectangles[cx].position.y + rectangles[cx].size.height
				|| rectangles[cx].position.y >= rectangle.position.y + rectangle.size.height)
		{
			continue;
		}

		return true;
	}
	
	return false;
}
function calculatePosition(top: any, size: any, rectangles: any, x: any) {
	const rectangle = {
		position: {
			x: 0,
			y: top,
		},
		size: size,
	};
	for (let cx = 0; cx < x.length; cx++) {
		rectangle.position.x = x[cx];
		if (intersect(rectangle, rectangles)) {
			continue;
		}

		return {
			x: x[cx],
			y: top,
		};
	}

	return {
		x: 0,
		y: top,
	};
}
