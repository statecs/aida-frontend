import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './PopupForm.css';
import AlertInformation from './AlertInformation';

const PopupForm = ({ handleClose, show }) => {

    return (
        <Modal
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            onHide={handleClose}
            backdrop='static'
            enforceFocus={true}
            dialogClassName="alert-modal"
            centered
        >
        <Modal.Body>
            <AlertInformation/>
            <h2 role="alertdialog">Är det livshotande eller akuta besvär?</h2>
            <Button className="agreeBtn call-btn" variant="secondary" aria-label="Ring 112" onClick={handleClose}>Ring 112</Button>
            <Button className="agreeBtn" variant="primary" aria-label="Nej, det är inte livshotande" onClick={handleClose}>Nej, det är inte livshotande</Button>

        </Modal.Body>
        </Modal>
    );
};

export default PopupForm;