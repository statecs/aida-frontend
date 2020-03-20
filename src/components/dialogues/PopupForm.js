import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './PopupForm.css';

const PopupForm = ({ handleClose, show }) => {

    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={handleClose}
            backdrop='static'
            enforceFocus={true}
            centered
        >
        <Modal.Body>
            <h2 aria-label="Är det livshotande eller akuta besvär?">Är det livshotande eller akuta besvär?</h2>
            <Button className="agreeBtn" variant="secondary" aria-label="Ring 112" onClick={handleClose}>Ring 112</Button>
            <Button className="agreeBtn" variant="primary" aria-label="Nej, det är inte livshotande" onClick={handleClose}>Nej, det är inte livshotande</Button>

        </Modal.Body>
        </Modal>
    );
};

export default PopupForm;