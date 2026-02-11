import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { NativeTypes } from "react-dnd-html5-backend"
import { useDrop } from "react-dnd"

export function UploadModal(props: any) {
	const onClose = props.onClose;

	const [selectedFile, setSelectedFile] = useState<any>();
	const [isFilePicked, setIsFilePicked] = useState(false);

	const changeHandler = (event: any) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const handleSubmission = () => {
		const formData = new FormData();
		formData.append("file", selectedFile);
		fetch("./api/big-history/upload", {
			method: "POST",
			body: formData,
		})
			.then((response) => {
				console.log(response);
				response.json();
			})
			.then((result) => {
				console.log("Success:", result);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	const [{ isOver, canDrop }, drop] = useDrop(
		() => ({
			accept: [NativeTypes.FILE],
			drop: (item: any) => {
				setSelectedFile(item.files[0]);
				setIsFilePicked(true);
			},
			canDrop: (item) => {
				const possible = item.items.length === 1
					&& item.items[0].kind === "file"
					&& item.items[0].type === "application/json"
					;
				return possible
			},
			collect: (monitor) => ({
				isOver: !!monitor.isOver(),
				canDrop: !!monitor.canDrop(),
			}),
		})
	);

	const isActive = canDrop && isOver;
	let clazz = "p-4 text-start";
	if (isOver && canDrop) {
		clazz += " bg-danger";
	} else if (isOver && !canDrop) {
		clazz += " bg-success";
	}

	return (
		<>
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Upload
				</Modal.Title>
				<Button variant="primary mx-4" onClick={onClose}>Close</Button>
			</Modal.Header>
			<Modal.Body>
				<div ref={drop} className={clazz}>
					<div className="p-4">
						<div className="form-group row my-1">
							<label className="col-4 col-form-label text-end">file</label>
							<div className="col-8">
								<input type="file" className="form-control" name="file" onChange={changeHandler} />
							</div>
						</div>
					</div>

					{isFilePicked ? (
						<div className="p-4">
							<div className="form-group row my-1">
								<label className="col-4 col-form-label text-end">Filename</label>
								<div className="col-8">
									<input type="text" className="form-control" value={selectedFile.name} readOnly/>
								</div>
							</div>
							<div className="form-group row my-1">
								<label className="col-4 col-form-label text-end">Filetype</label>
								<div className="col-8">
									<input type="text" className="form-control" value={selectedFile.type} readOnly/>
								</div>
							</div>
							<div className="form-group row my-1">
								<label className="col-4 col-form-label text-end">Size in bytes</label>
								<div className="col-8">
									<input type="text" className="form-control" value={selectedFile.size} readOnly/>
								</div>
							</div>
							<div className="form-group row my-1">
								<label className="col-4 col-form-label text-end">lastModifiedDate</label>
								<div className="col-8">
									<input type="text" className="form-control" value={selectedFile.lastModifiedDate.toLocaleDateString()} readOnly/>
								</div>
							</div>
						</div>
					) : (
						<div className="form-group row my-1">
							<label className="col-4 col-form-label text-end"></label>
							<div className="col-8">
								Select a file to show details
							</div>
						</div>
					)}
					<div className="form-group row my-1">
						<label className="col-4 col-form-label text-end"></label>
						<div className="col-8">
							{isActive ? "Release to drop" : "Drag file here"}
						</div>
					</div>
					<div className="form-group row my-4 text-end">
						<Button variant="primary" onClick={handleSubmission}>Submit</Button>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onClose}>Close</Button>
			</Modal.Footer>
		</Modal>

		</>
	)
}
