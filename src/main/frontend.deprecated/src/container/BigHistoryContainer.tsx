import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { Button, Col, Dropdown, Form, InputGroup, Row } from "react-bootstrap";

// model
import { BigHistoryForm } from "../model/BigHistoryModel";

// store
import store, { ONE_SOLAR_YEAR, UNIVERSE_AGE, TIME_LINE, } from "../store/BigHistoryStore";

// view
import LandscapeView from "../view/LandscapeView";
import { CreateModal } from "../view/CreateModal";
import { UploadModal } from "../view/UploadModal";

// BigHistoryContainer.tsx
export default function BigHistoryContainer(_: any) {
	const [form, setForm] = useState<BigHistoryForm>({
		start: UNIVERSE_AGE + 1000 * ONE_SOLAR_YEAR,
		end: UNIVERSE_AGE + 2050 * ONE_SOLAR_YEAR,
		width: 1024 * 1,
		height: 1024,
		margin: 16,
		mode: 0,
	});

	function onChange(param: any) {
		setForm({
			...form,
			...param,
		});
	}

	const modes = [
		<LandscapeView
			form={form}
			onChange={onChange}
		/>,
		<AgGridView
			form={form}
		/>,
	];

	return (<>
		<Header
			form={form}
			onChange={onChange}
		/>
		{modes[form.mode % modes.length]}
	</>);
}


function Header(props: any) {
	const form = props.form as BigHistoryForm;
	const { onChange } = props;

	const times = TIME_LINE;

	const [showUploadModal, setShowUploadModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);

	return (<>
		<Row className="mx-0 py-1 bg-dark border-top border-secondary">
			<Col xs="auto" className="text-white text-start mx-1 p-0">
				<InputGroup size="sm">
					<Form.Select size="sm" className="bg-dark text-white" value={form.start || ""}
						onChange={(event: any) => onChange && onChange({ start: event.target.value, })}
					>
						<option value="">start</option>
						{times.map((time: any) => (<option key={Math.random()} value={time[0]}>{store.format(time[0])}</option>))}
					</Form.Select>
					<Form.Select size="sm" className="bg-dark text-white" value={form.end || ""}
						onChange={(event: any) => onChange && onChange({ end: event.target.value, })}
					>0
						<option value="">end</option>
						{times.map((time: any) => (<option key={Math.random()} value={time[0]}>{store.format(time[0])}</option>))}
					</Form.Select>
				</InputGroup>
			</Col>
			<Col xs="auto" className="text-white text-start m-0 p-0">
				<InputGroup size="sm">
					<Button size="sm" variant="secondary" className="ms-1" onClick={(_: any) => onChange && onChange({ start: times[0][0], end: times[times.length - 1][0]})}>우주</Button>
					<Button size="sm" variant="secondary" className="ms-1" onClick={(_: any) => onChange && onChange({ start: times[3][0], end: times[7][0]})}>지구</Button>
					<Button size="sm" variant="secondary" className="ms-1" onClick={(_: any) => onChange && onChange({ start: times[8][0], end: times[12][0]})}>한반도</Button>
				</InputGroup>
			</Col>
			<Col xs="auto" className="text-white text-start m-0 p-0 me-auto">
			</Col>
			<Col xs="auto" className="text-white text-start mx-1">
				<InputGroup size="sm">
					<Dropdown>
						<Dropdown.Toggle id="dropdown-menu" size="sm" >Menu</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={(param: any) => store.download({})}>Download</Dropdown.Item>
							<Dropdown.Divider />
							<Dropdown.Item onClick={(param: any) => store.download({})}>Download</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<Button size="sm" variant="secondary" className="ms-1" onClick={(_: any) => setShowCreateModal(true)}>Create</Button>
					<Button size="sm" variant="secondary" className="ms-1" onClick={(_: any) => setShowUploadModal(true)}>Upload</Button>
					<Button size="sm" variant="secondary" className="ms-1" title={form!.mode!.toString()} onClick={(_: any) => onChange && onChange({ mode: form!.mode + 1, })}>mode</Button>
				</InputGroup>
			</Col>
		</Row>
		<UploadModal
			show={showUploadModal}
			onClose={() => setShowUploadModal(false)}
		/>
		<CreateModal
			show={showCreateModal}
			onClose={() => setShowCreateModal(false)}
		/>
	</>);
}
function AgGridView(props: any) {
	const form = props.form as BigHistoryForm;

	const gridRef = useRef<AgGridReact>(null);
	const [refresh, setRefresh] = useState(false);
	const [root, setRoot] = useState({});
	const [rowData, setRowData] = useState<any[]>([]);
	const [columnDefs, setColumnDefs] = useState([]);

	useEffect(() => {
		const comlumDefs = store.columnDefs(["created"]);
		setColumnDefs(comlumDefs);
	}, []);
	useEffect(() => {
		store.search({}, (_: any, result: any) => setRowData(result));
		return function() { setRoot({}); };
	}, [form, refresh]);
	useEffect(() => {
		function a(history: any, histories: any[]) {
			if (!history || !histories) {
				return;
			}

			histories.push(history);
			history.children?.forEach((child: any) => a(child, histories));
		}
		const histories: any[] = [];
		a(root, histories);
		setRowData(histories);
		return function() { setRowData([]); };
	}, [root]);

	function handleOnCellValueChangedAgGridReact(params: any) {
		const updating = {
			id: params.data.id,
			[params.colDef.field]: params.value,
		};
		store.update(updating, () => setRefresh(!refresh), () => setRefresh(!refresh));
	}
	function handleOnGridReady() {
		gridRef.current!.api.sizeColumnsToFit();
		gridRef.current!.api.setGridOption("domLayout", "autoHeight");
	}

	return (<>
		<AgGridReact
			className="ag-theme-balham-dark"
			ref={gridRef}
			rowData={rowData}
			columnDefs={columnDefs}
			defaultColDef={{
				editable: true,
				sortable: true,
				resizable: true,
				suppressHeaderMenuButton: true,
			}}
			rowDragManaged={true}
			rowSelection="multiple"
			onGridReady={handleOnGridReady}
			stopEditingWhenCellsLoseFocus={true}
			onCellValueChanged={handleOnCellValueChangedAgGridReact}
		/>
	</>);
}
