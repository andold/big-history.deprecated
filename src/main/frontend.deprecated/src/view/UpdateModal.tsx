import React, { useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { getTextTime } from "./Utility";

export function UpdateModal(props: any) {
	// properties
	const history = {...props.history};
	const onClickButtonClose = props.onClickButtonClose;
	const onUpdated = props.onUpdated;
	const onDeleted = props.onDeleted;

	const rendered = useRef(0);
	const [start, setStart] = useState(getTextTime(history.start));
	const [end, setEnd] = useState(getTextTime(history.end));
	const [form, setForm] = useState<any>({ ...history });

	let title = (history.start === history.end) ? start : start + " ~ " + end;

	function onChangeStart(e: any) {
		setStart(e.currentTarget.value);
	}
	function onChangeEnd(e: any) {
		setEnd(e.currentTarget.value);
	}
	function onChangeDecriptionText(e: any) {
		//jQuery("form textarea[name=description").val(jQuery(e.target).val());
		setForm({
			...form,
			description: e.currentTarget.value,
		});
	}
	function onPasteDescription(event: any) {
		const { clipboardData } = event;
		var pastedDataHtml = clipboardData.getData("text/html");

		if (pastedDataHtml) {
			//jQuery("#html-description").html(pastedDataHtml);
			//jQuery("form textarea[name=description").val(pastedDataHtml);
			setForm({
				...form,
				description: pastedDataHtml,
				htmlDescription: pastedDataHtml
			});
		} else {
			//jQuery("#html-description").html(jQuery(event.target).val());
			//jQuery("form textarea[name=description").val(jQuery(event.target).val());
			setForm({
				...form,
				description: event.currentTarget.value,
				htmlDescription: event.currentTarget.value
			});
		}
	}
	function onUpdate() {
		fetch("./api/big-history/" + history.id, {
		        method: "PUT",
		        headers: { "Content-Type": "application/json" },
				/*
		        body: JSON.stringify({...history,
		        	parentId: jQuery("form input[name=parentId]").val(),
		        	start: jQuery("form input[name=start]").val(),
		        	end: jQuery("form input[name=end]").val(),
		        	title: jQuery("form input[name=title]").val(),
		        	description: jQuery("form textarea[name=description]").val(),
		        }),
				*/
				body: JSON.stringify(form),
	        })
	        .then((response) => {
	            return response.json();
	        })
	        .then(function (result) {
				console.log(history, result);
				onUpdated(result);
	        });
	}
	function onDelete() {
		fetch("./api/big-history/" + history.id, {
		        method: "DELETE",
	        })
	        .then((response) => {
	            return response.json();
	        })
	        .then(function (result) {
				console.log(history, result);
				onDeleted(result);
	        });
	}

	rendered.current++;

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					수정 화면: {history.title}
					<small className="p-4">{title}</small>
					<small className="p-4">{history.parentId}</small>
					<small className="p-4">{rendered.current}</small>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form name="form-update" className="border border-secondary rounded m-3 py-3" method="post">
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">id</label>
						<div className="col-9">
							<input type="number" className="form-control" name="id" defaultValue={history.id} readOnly/>
						</div>
					</div>
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">parent</label>
						<div className="col-9">
							<input type="number" className="form-control" name="parentId" defaultValue={history.parentId}
								onChange = { function(e) { history.parentId = e.target.value; }} />
						</div>
					</div>
					
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">start</label>
						<div className="col-5">
							<input type="text" className="form-control" name="start-text" defaultValue={start} onChange={onChangeStart} />
						</div>
						<div className="col-4">
							<input type="text" className="form-control" name="start" readOnly />
						</div>
					</div>
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">end</label>
						<div className="col-5">
							<input type="text" className="form-control" name="end-text" defaultValue={end} onChange={onChangeEnd} />
						</div>
						<div className="col-4">
							<input type="text" className="form-control" name="end" readOnly />
						</div>
					</div>

					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">title</label>
						<div className="col-9">
							<input type="text" className="form-control" name="title" defaultValue={history.title}
								onChange = { function(e) { history.title = e.target.value; }} />
						</div>
					</div>
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">description</label>
						<div className="col-4">
							<textarea rows={8}
								className="form-control"
								name="description-text"
								defaultValue={history.description}
								value={form.description}
								onPaste={onPasteDescription}
								onChange={onChangeDecriptionText}
							></textarea>
						</div>
						<div className="col-5">
							<textarea rows={8}
								className="form-control"
								name="description"
								defaultValue={history.description}
								value={form.description}
								readOnly
							></textarea>
						</div>
					</div>
					<div className="form-group row m-1">
						<label className="col-2 col-form-label text-end">html</label>
						<div className="col-9 overflow-auto p-1 border" id="html-description"
								style={{ height: "12rem" }} dangerouslySetInnerHTML={{ __html: history.description }}></div>
					</div>
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">created</label>
						<div className="col-9">
							<input type="datetime" className="form-control" name="created" defaultValue={history.created} readOnly/>
						</div>
					</div>
					<div className="form-group row my-1">
						<label className="col-2 col-form-label text-end">updated</label>
						<div className="col-9">
							<input type="datetime" className="form-control" name="updated" defaultValue={history.updated} readOnly/>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onUpdate}>Update</Button>
				<Button variant="secondary" onClick={onClickButtonClose}>Close</Button>
				<Button variant="secondary" onClick={onDelete}>Delete</Button>
			</Modal.Footer>
		</Modal>
	);

}
