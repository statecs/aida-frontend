

import React, {useState} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function Feedback() {

  const [show, setShow] = useState(true);

  if (show) {
    return (
   <Alert variant="info" onClose={() => setShow(false)} dismissible>
  <Alert.Heading>Välkommen till Symtomguiden!</Alert.Heading>
  <p>
  Detta är en prototyp och kan inte ses som någon medicinteknisk produkt.</p>
  <hr />
  <p className="mb-0">
   <a target="_blank" href="https://forms.gle/zePVFDn9ZWH8cq7S9">Vill du lämna synpunkter?</a>
  </p>
</Alert>
    );
  }
  return <span></span>;
}


export default Feedback;