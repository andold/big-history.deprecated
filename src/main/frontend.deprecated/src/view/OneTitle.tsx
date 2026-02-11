import React, { useContext, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { TbArrowsMinimize, TbArrowsMaximize } from "react-icons/tb";

import { OneContext } from "./OneContext";
import { DisplayModal } from "./DisplayModal";
import { UpdateModal } from "./UpdateModal";
import { getTextTime } from "./Utility";

export function OneTitle(props: any) {
	// properties
	const history = props.history;
	const rectangle = props.rectangle;
	const propargate = props.onChangeSize;
	const onToggle = props.onToggle;
	const collapsed = props.collapsed;

	const context = useContext(OneContext);
	const [state, setState] = useState<any>({
		modalShow: false
		, updateModalShow: false
		, minimalized: false
	});
	const [{ isDragging }, drag] = useDrag(
		() => ({
			type: "KNIGHT",
			item: history,
			collect: (monitor) => ({
				isDragging: !!monitor.isDragging(),
			}),
		}),
		[],
	);
	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: "KNIGHT",
			drop: (dropped: any) => {
				if (dropped.id === history.id) {
					return;
				}

				dropped.parentId = history.id;
			fetch("./api/big-history/" + dropped.id, {
			        method: "PUT",
			        headers: { "Content-Type": "application/json" },
			        body: JSON.stringify({
						parentId: history.id,
					}),
		        })
		        .then((response) => {
		            return response.json();
		        });
				propargate(history);
			},
			canDrop: (item) => {
				const can = item.id !== history.id;
				return can;
			},
			collect: (monitor) => ({
		      isOver: !!monitor.isOver(),
		      canDrop: !!monitor.canDrop(),
		    }),
		})
	);

	if (!history || !rectangle!.size) {
		return (<></>);
	}

	const isEvent = history.start === history.end;
	const hasNoChild = !history.children || !history.children.length;

	const periodStart = getTextTime(props.history.start);
	const periodEnd = (props.history.start === props.history.end) ? "" : getTextTime(props.history.end);

	function onClickButtonClose() {
		setState({ ...state, modalShow: false, updateModalShow: false });
	}
	function onClickButtonUpdate() {
		setState({ ...state, modalShow: false, updateModalShow: true });
	}
	function onClickUpdateModalButtonClose() {
		setState({ ...state, modalShow: false, updateModalShow: false });
	}
	function onUpdated(value: any) {
		setState({ ...state, modalShow: false, updateModalShow: false });
		propargate(value);
	}
	function onDeleted(value: any) {
		setState({ ...state, modalShow: false, updateModalShow: false });
		propargate(value);
	}
	const isActive = isOver && canDrop;


	let title = history.title + " " + periodStart + " ~ " + periodEnd;
	let clazz = "position-absolute shadow-sm bg-opacity-10 border-secondary rounded-2";
	if (isEvent) {
		clazz += " bg-danger";
	} else if (hasNoChild) {
		clazz += " bg-dark";
	} else {
		clazz += " bg-success";
	}
	clazz += isActive ? " border border-3 border-primary" : " border-secondary";

	let style: any = {
		textAlign: "left"
		, paddingLeft: "0.5rem"
	};
	if (rectangle.writingModeVertical) {
		style = {
			writingMode: "vertical-lr"
			, textOrientation: "mixed"
			, textAlign: "right"
			, display: "flex"
			, alignItems: "center"
		};
	}
	const left = rectangle.position.x;
	const top = rectangle.position.y;


	return (
		<div className={clazz} title={title}
			ref={drop}
			style={{
				left: left,
				top: top,
				width: rectangle.size.width,
				fontSize: context.font.size,
			}}>
			<div className={clazz}
				style={{
					width: "100%",
					height: rectangle.size.height,
				}}>
				<div className="sticky-top d-flex flex-column"
					style={{
						top: 8,
						cursor: "pointer",
					}}>
					<div className="text-nowrap text-end">
						<TitleDropDownMenu
							history = {history}
							width = {rectangle.size.width}
							onToggle = {onToggle}
							collapsed = {collapsed}
						/>
						<sup>{periodStart}</sup>
					</div>
					<div className="position-absolute d-inline-block d-fload text-nowrap text-secondary text-end"
						style={{
							marginTop: "12px",
							right: 0
						}}>
					</div>
					<div className="--text-nowrap"
						ref={drag}
						onClick={() => setState({ modalShow: true, updateModalShow: false })}
						style={{...style,
							color: isDragging ? "red" : "auto",
						}}>
						{history.title}
					</div>
					<div className="text-nowrap text-secondary text-end">
						<sub>{periodEnd}</sub>
					</div>
				</div>
			</div>
			<DisplayModal
				history={history}
				show={state.modalShow}
				onClickButtonClose={onClickButtonClose}
				onClickButtonUpdate={onClickButtonUpdate}
			/>
			<UpdateModal
				history={history}
				show={state.updateModalShow}
				onClickButtonClose={onClickUpdateModalButtonClose}
				onUpdated = { onUpdated }
				onDeleted = { onDeleted }
			/>
		</div>
	);
}

function TitleDropDownMenu (props: any) {
	const history = props.history;
	const width = props.width;
	const onToggle = props.onToggle;
	const collapsed = props.collapsed;

	const hasNoChild = !history.children || !history.children.length;

	if (hasNoChild) {
		return (
			<>
			</>
		);
	}

	if (collapsed) {
		return (
			<>
			<div className="position-absolute p-0 m-0" style={{
					left: width / 8
				,	top: width / 4
			}}>
				<TbArrowsMaximize onClick={onToggle} />
			</div>
			</>
		);
	}
	return (
		<>
		<div className="position-absolute p-0 m-0" style={{
				left: width / 8,
				top: width / 4
		}}>
			<TbArrowsMinimize onClick={onToggle} />
		</div>
		</>
	);
}
