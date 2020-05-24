

import React from 'react';
import Alert from 'react-bootstrap/Alert';

function Feedback() {

  const HidePopup = localStorageKey => {
  const [show, setShow] = React.useState(
    localStorage.getItem(localStorageKey) || true
  );

  React.useEffect(() => {
    localStorage.setItem(localStorageKey, show);
  });
  return [JSON.parse(show), setShow];
};


 const [show, setShow] = HidePopup(
    'showAlert'
  );

  var showPopupForm = () => setShow(true);
  var closePopupForm = () => setShow(false);   

  if (show) {
    return (
   <Alert className="msg" variant="light" onClose={() => closePopupForm()} dismissible>
  <Alert.Heading>Välkommen till Symtomguiden!</Alert.Heading>
  <p className="alertText">
     Detta är en prototyp och kan idag svara på frågor kring huvudvärk, halsont och hosta och feber. Det ska inte ses som någon färdig produkt.</p>
  <hr />
  <p className="mb-0">
   <a target="_blank" rel="noopener noreferrer" href="https://forms.gle/zePVFDn9ZWH8cq7S9">Vill du lämna synpunkter?</a>
  </p>
</Alert>
    );
  } else
  {
      return (
        <div className="msg-closed">
          <button onClick={() => showPopupForm()}>Vill du lämna synpunkter?</button>
        </div>
      )
  }
}


export default Feedback;