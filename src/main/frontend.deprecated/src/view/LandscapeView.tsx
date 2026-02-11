import React, { useEffect, useState } from "react";
import { Col, OverlayTrigger, Popover, Row } from "react-bootstrap";

// model
import BigHistory, { BigHistoryForm, Position, Size } from "../model/BigHistoryModel";

// store
import store from "../store/BigHistoryStore";

// LandscapeView.tsx
const COLORS = ["red", "black", "yellow", "green", "pink"];
export default ((props: any) => {
	const form = props.form as BigHistoryForm;

	const [histories, setHistories] = useState<BigHistory[]>([]);
	const [start, setStart] = useState<number>(0);
	const [end, setEnd] = useState<number>(1);
	const [height, setHeight] = useState<number>(0);
	const [position] = useState<Position>({ x: 0, y: 0 });
	const [size, setSize] = useState<Size>({ width: 1280, height: 128 });

	useEffect(() => {
		store.search(form, (_: any, result: BigHistory[]) => setHistories(result.sort((a: BigHistory, b: BigHistory) => a.start - b.start || b.end - a.end)));
	}, [form]);

	useEffect(() => {
		let min: number = Number.MAX_VALUE;
		let max: number = Number.MIN_VALUE;
		histories.forEach((history: BigHistory) => {
			min = Math.min(min, history.start);
			max = Math.max(max, history.end);
		});
		max = Math.min(max, 435454086754467650.);
		setStart(min);
		setEnd(max);
		setHeight(histories.length * 64);
		setSize({
			...size,
			height: histories.length * 64,
		});
	}, [histories]);

	return (<>
		<Row className="m-0 bg-black text-white"><Col>
			#{histories!.length}, {`${store.format(start)} ~ ${store.format(end)}`}
		</Col></Row>
		<Row className="m-0 bg-black text-white"><Col>
			<svg version="1.1" baseProfile="full" width={form.width + form.margin * 2 + 128} height={size.height + form.margin * 2} xmlns="http://www.w3.org/2000/svg">
				<TimeLine
					form={{ ...form, height: height, }}
					position={{
						x: position.x + 0,
						y: position.y + 0,
					}}
					size={{ ...size, height: 32, }}
					histories={histories}
					start={start}
					end={end}
				/>
				{histories.map((history: BigHistory, index: number) => (
					<SvgRectangle
						key={`${store.format(start)} ~ ${store.format(end)}-${index}`}
						form={{ ...form, height: height, }}
						position={{
							x: position.x + store.calculateX(history.start, start, end, size.width),
							y: position.y + index * 64 + 32,
						}}
						size={size}
						history={history}
						index={index}
						start={start}
						end={end}
					/>
				))}
			</svg>
		</Col></Row>
	</>);
});


function SvgRectangle(props: any) {
	const form = props.form as BigHistoryForm;
	const history = props.history as BigHistory;
	const origin = props.position as Position;
	const psize = props.size as Size;
	const { index, start, end } = props;

	const [size, setSize] = useState<Size>({ width: 128, height: 64 });
	const [rectangle, setRecectangle] = useState({
		x: 0,
		y: 0,
		width: 128,
		height: 64,
	});

	useEffect(() => {
		const width = end - start;
		let x = (history.start - start) / width * form.width + form.margin;
		let y = index * 64 + form.margin;
		x = store.calculateX(history.start, start, end, psize.width);
		const dx = store.calculateX(history.end, start, end, psize.width) - x;
		setRecectangle({
			x: x,
			y: y,
			width: dx,
			height: 63,
		});
		setSize({
			...size,
			width: dx,
		});
	}, [history, start, end]);

	const style = {
		stroke: "black",
		fontSize: 10,
		fontFamily: "맑은 고딕, Semilight",
		fontWeight: "initial",
	};
	const popover = (
		<Popover className="" style={{ width: 640 }} >
			<Popover.Header as="h3" className="">{history.title}</Popover.Header>
			<Popover.Body className="p-1" dangerouslySetInnerHTML={{ __html: history.description }}>
			</Popover.Body>
		</Popover>
	);

	return (<>
		<g>
			{/* 시간 요약 */}
			<rect x={origin.x} y={origin.y + size.height + 8} width={size.width} height={4} rx={0} ry={0}
				style={{
					fill: COLORS[index % COLORS.length],
					opacity: 0.5,
				}}
			/>
			{/* 시간 지시선 */}
			<rect x={origin.x} y={36} width={size.width} height={origin.y} fill="none" stroke="#808080" strokeWidth={1} opacity={0.1} />
			<OverlayTrigger trigger="click" placement="auto" overlay={popover}>
				{/* 영역 */}
				<rect x={rectangle.x} y={rectangle.y + 32} width={Math.max(128, rectangle.width)} height={rectangle.height} rx={2} ry={2} fill="#808080" stroke="black" strokeWidth={1} opacity={0.9} />
			</OverlayTrigger>
			<text x={rectangle.x} y={rectangle.y + 32} style={style}>
				<tspan x={rectangle.x} y={rectangle.y + 32} dy={16} dx={4}>{store.format(history.start)}</tspan>
				<tspan x={rectangle.x} y={rectangle.y + 32} dy={16} dx={64}>{store.format(history.end)}</tspan>
			</text>
			<path
				id={`path-${history.id}`}
				fill="none"
				stroke="none"
				d={`M${rectangle.x + 4},${rectangle.y + 64} L${rectangle.x + Math.max(128, rectangle.width) - 8},${rectangle.y + 64} M${rectangle.x + 4},${rectangle.y + 64 + 16} L${rectangle.x + Math.max(128, rectangle.width) - 8},${rectangle.y + 64 + 16}`} />
			<text style={style}>
				<textPath href={`#path-${history.id}`}>{history.title}</textPath>
			</text>
		</g>
	</>);
}
function TimeLine(props: any) {
	const form = props.form as BigHistoryForm;
	const histories = props.histories as BigHistory[];
	const origin = props.position as Position;
	const size = props.size as Size;
	const { start, end } = props;

	const xmin = store.calculateX(start, start, end, size.width);
	const xmax = store.calculateX(end, start, end, size.width);

	return (<>
		<g>
			<rect x={origin.x + xmin} y={origin.y} width={xmax - xmin} height={36} rx={2} ry={2} fill="none" stroke="black" strokeWidth={1} opacity={0.5} />
			{histories.map((history: BigHistory, index: number) => {
				const x1 = store.calculateX(history.start, start, end, size.width);
				const x2 = store.calculateX(history.end, start, end, size.width);
				return (
					<g key={history.id}>
						<rect x={origin.x + x1} y={origin.y + (index % 8) * 4} width={x2 - x1 + 1} height={8} rx={0} ry={0} opacity={0.1} fill={COLORS[index % COLORS.length]} />
						<line x1={origin.x + x1} y1={origin.y} x2={origin.x + x1} y2={origin.y + 36} stroke="black" opacity={0.2} />
						<line x1={origin.x + x2} y1={origin.y} x2={origin.x + x2} y2={origin.y + 36} stroke="black" opacity={0.1} />
					</g>
				);
			}
			)}
		</g>
	</>);
}
