

import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function AlertInformation() {

  const [show, setShow] = useState(true);

  if (show) {
    return (
    <Alert variant="light">
  <Alert.Heading>Välkommen till Symtomguiden!</Alert.Heading>
  <p>
  Detta är en prototyp och kan idag svara på frågor kring huvudvärk, halsont och hosta och feber. Den ska inte ses som någon medicintekniskt produkt.</p>
</Alert>
    );
  }
  return <span></span>;
}

//export render(<AlertDismissibleExample />);

export default AlertInformation;