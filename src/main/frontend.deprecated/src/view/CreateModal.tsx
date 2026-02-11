import React, { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";

export function CreateModal(props: any) {
	// properties
	const onClose = props.onClose;
	const onCreated = props.onCreated;


	const rendered = useRef(0);
	const [title, setTitle] = useState("");
	const [start, setStart] = useState("");
	const [end, setEnd] = useState("");
	const [description, setDescription] = useState("");
	const [htmlDescription, setHtmlDescription] = useState("");

	function onPasteDescription(event: any) {
		const { clipboardData } = event;
		var pastedData = clipboardData.getData("text");
		var pastedDataHtml = clipboardData.getData("text/html");

		if (pastedDataHtml) {
			setHtmlDescription(pastedDataHtml);
			setDescription(pastedDataHtml);
		} else {
			setHtmlDescription(pastedData);
			setDescription(pastedData);
		}
	}
	function onChangeStart(event: any) {
		const text = event.target.value;
		fetch("./api/parse-date-time?text=" + text, {
	        method: "GET",
	    })
	    .then((response) => {
	        return response.json();
	    })
	    .then(function (result) {
			console.log(text, result);
			setStart(result.value);
			return result.value;
	    });
	}
	function onChangeEnd(event: any) {
		const text = event.target.value;
		fetch("./api/parse-date-time?text=" + text, {
	        method: "GET",
	    })
	    .then((response) => {
	        return response.json();
	    })
	    .then(function (result) {
			console.log(text, result);
			setEnd(result.value);
			return result.value;
	    });
	}
	function onCreate() {
		fetch("./api", {
		        method: "POST",
		        headers: { "Content-Type": "application/json" },
		        body: JSON.stringify({
					id: null,
					parentId: 0,
					start: start,
					end: end,
					title: title,
					description: description,
					collapsed: false,
					created: null,
					updated: null,
				}),
	        })
	        .then((response) => {
	            return response.json();
	        })
	        .then(function (result) {
				console.log(result);
				onCreated && onCreated(result);
	        });
	}

	rendered.current++;

	// start
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					생성 화면
					<small className="p-4">{rendered.current}</small>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form name="form-update" className="border border-secondary rounded m-3 py-3" method="post">
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">id</label>
						<div className="col-9 d-none">
							<input type="number" className="form-control" name="id" readOnly />
						</div>
					</div>
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">parent</label>
						<div className="col-9">
							<input type="number" className="form-control" name="parentId" value={0} readOnly />
						</div>
					</div>
					
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">title</label>
						<div className="col-9">
							<input type="text" className="form-control" name="title" value={title}
								onChange={(event: any) => setTitle(event.target.value)} />
						</div>
					</div>
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">start</label>
						<div className="col-5">
							<input type="text" className="form-control" name="start-text" onChange={onChangeStart} />
						</div>
						<div className="col-4">
							<input type="text" className="form-control" name="start" value={start} readOnly  />
						</div>
					</div>
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">end</label>
						<div className="col-5">
							<input type="text" className="form-control" name="end-text" onChange={onChangeEnd} />
						</div>
						<div className="col-4">
							<input type="text" className="form-control" name="end" value={end} readOnly  />
						</div>
					</div>
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">description</label>
						<div className="col-4">
							<textarea rows={8}
								className="form-control"
								name="input-description"
								onPaste={onPasteDescription}
							></textarea>
						</div>
						<div className="col-5">
							<textarea rows={8}
								className="form-control"
								name="description"
								readOnly 
							></textarea>
						</div>
					</div>
					<div className="form-group row m-1">
						<label className="col-2 col-form-label text-end">html</label>
						<div className="col-9 overflow-auto p-1 border"
								style={{ height: "12rem" }}>{htmlDescription}</div>
					</div>
					<div className="form-group row m-1">
						<div className="form-check form-switch offset-2 col-9">
							<input className="form-check-input" type="checkbox" role="switch" id="collapsed" name="collapsed" />
							<label className="form-check-label">collapsed</label>
						</div>
					</div>
					<div className="form-group row my-1 d-none">
						<label className="col-2 col-form-label text-end">created</label>
						<div className="col-9">
							<input type="datetime" className="form-control" name="created" readOnly />
						</div>
					</div>
					<div className="form-group row my-1 d-none">
						<label className="col-2 col-form-label text-end">updated</label>
						<div className="col-9">
							<input type="datetime" className="form-control" name="updated" readOnly />
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onCreate}>Create</Button>
				<Button variant="secondary" onClick={onClose}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}
