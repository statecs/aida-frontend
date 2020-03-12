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
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                    Är det livshotande eller akuta besvär?
        </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Button className="agreeBtn" onClick={handleClose}>Nej, det är inte livshotande</Button>
                <Button className="agreeBtn" onClick={handleClose}>Ring 112</Button>
            </Modal.Body>
            <Modal.Footer>
                
            </Modal.Footer>
        </Modal>
    );
};

export default PopupForm;