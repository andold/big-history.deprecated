import React from "react";
import { Modal, Button } from "react-bootstrap";
import { getTextTime } from "./Utility";

export function DisplayModal(props: any) {
	// properties
	const history = props.history;
	const onClickButtonUpdate = props.onClickButtonUpdate;
	const onClickButtonClose = props.onClickButtonClose;

	let periodStart = getTextTime(history.start);
	let periodEnd = (history.start === history.end) ? "" : getTextTime(history.end);
	let title = (history.start === history.end) ? periodStart : periodStart + " ~ " + periodEnd;

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					<small className="p-4">{history.id}</small>
					{history.title}
					<small className="p-4">{title}</small>
					<small className="p-4">{history.parentId}</small>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body dangerouslySetInnerHTML={{ __html: history.description }}>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onClickButtonUpdate}>Update</Button>
				<Button variant="secondary" onClick={onClickButtonClose}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}
