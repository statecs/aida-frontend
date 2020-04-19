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
            dialogClassName="alert-modal"
            centered
        >
        <Modal.Body>
        <div className="container-home">
        <h1 className="site-logo-popup"> 
                  
                        <span itemProp="logo" itemType="http://schema.org/ImageObject" aria-label="Symptomkollen"> 
                    <svg width="120px" height="120px" viewBox="0 0 129 129" version="1.1">
                        <g id="Prototype" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                            <g id="Second-screen" transform="translate(-224.000000, -184.000000)">
                                <g id="Group-5" transform="translate(226.000000, 186.000000)">
                                    <circle  stroke="#979797" strokeWidth="4" cx="62.5" cy="62.5" r="62.5"></circle>
                                    <circle  fill="#979797" cx="47.5" cy="67.5" r="5.5"></circle>
                                    <circle  fill="#979797" cx="61.5" cy="67.5" r="5.5"></circle>
                                    <circle  fill="#979797" cx="75.5" cy="67.5" r="5.5"></circle>
                                    <path d="M25,96.0416306 L25,47.0416306 C25.24856,33.722196 36.1221285,23 49.5,23 C62.8778715,23 73.75144,33.722196 73.995799,47.0416817 L74,47.0416306 C87.3199008,47.2906634 98.0416306,58.1640499 98.0416306,71.5416306 C98.0416306,84.9192112 87.3199008,95.7925977 74.0008177,96.0374136 L74,96.0416306 L25,96.0416306 Z" id="Combined-Shape" stroke="#979797" strokeWidth="4" transform="translate(61.520815, 59.520815) rotate(315.000000) translate(-61.520815, -59.520815) "></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                                            
                    </span> 
                   <p className="logoText">Symtomguiden</p>
                </h1></div>

           
            <h2 class="center" role="alertdialog">Är det livshotande eller akuta besvär?</h2>
            <p class="center" >Tänk på att du endast ska ringa 112 när du är i en nödsituation som kräver omedelbar hjälp.</p>
            <Button className="agreeBtn call-btn" variant="secondary" aria-label="Ring 112" onClick={handleClose}>Ring 112</Button>
            <Button className="agreeBtn" variant="primary" aria-label="Nej, det är inte livshotande" onClick={handleClose}>Nej, det är inte livshotande</Button>

        </Modal.Body>
        </Modal>
    );
};

export default PopupForm;