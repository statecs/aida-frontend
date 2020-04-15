

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
  Detta är en prototyp och kan inte ses som någon medicinteknisk produkt.</p>
</Alert>
    );
  }
  return <span></span>;
}

//export render(<AlertDismissibleExample />);

export default AlertInformation;