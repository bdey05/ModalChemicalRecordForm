let nameCount = 2;

window.onload = () => {
  document.getElementById("initialname").addEventListener("click", (e) => {
    e.target.parentNode.remove();
    nameCount--;
    if (nameCount == 2) {
      document.getElementById("names").children[0].children[1].disabled = true;
    }
  });
};

let createNameField = () => {
  if (nameCount == 2) {
    document.getElementById("names").children[0].children[1].disabled = false;
  }

  let nameField = document.createElement("INPUT");
  nameField.setAttribute("type", "text");
  nameField.setAttribute("Placeholder", "Chemical Name");
  nameField.setAttribute("Name", "Name " + nameCount);
  nameField.required = true;

  let addbtn = document.createElement("button");
  addbtn.setAttribute("type", "button");
  addbtn.setAttribute("value", "Add");
  addbtn.addEventListener("click", createNameField);
  let addtext = document.createTextNode("Add");
  addbtn.append(addtext);

  let deletebtn = document.createElement("button");
  deletebtn.setAttribute("type", "button");
  deletebtn.setAttribute("value", "Delete");
  deletebtn.addEventListener("click", (e) => {
    e.target.parentNode.remove();
    nameCount--;
    if (nameCount == 2) {
      document.getElementById("names").children[0].children[1].disabled = true;
    }
  });

  let btntext = document.createTextNode("Delete");
  deletebtn.append(btntext);

  let nameDiv = document.createElement("div");
  nameDiv.classList.add("nameDiv");
  nameDiv.append(nameField);

  nameDiv.append(deletebtn);

  document.getElementById("names").appendChild(nameDiv);
  nameCount++;
};

let generateChemicalJSON = () => {
  let chemicalJSON = {};
  document.getElementById("error").innerHTML = "";
  document.getElementById("chemicalRecordOutput").children[0].innerHTML = "";
  document.getElementById("chemicalRecordOutput").children[1].innerHTML = "";
  const chemicalNames = [];
  for (let i = 0; i < document.getElementById("names").children.length; i++) {
    chemicalNames.push(
      document.getElementById("names").children[i].children[0].value
    );
  }

  const CAS = document.getElementById("CASinput").value;
  if (!CASValidator(CAS)) {
    return displayError("Invalid CAS Number");
  }

  const wikidata = document.getElementById("wikidatainput").value;
  if (!wikidataValidator(wikidata)) {
    return displayError("Invalid URL");
  }

  if (document.getElementById("puresubstanceinput").checked) {
    const InChIKey = document.getElementById("InChIKeyinput").value;
    if (!InChIKeyvalidator(InChIKey)) {
      return displayError("Invalid InChIKey");
    }
    const InChI = document.getElementById("InChIinput").value;
    if (!InChIvalidator(InChI)) {
      return displayError("Invalid InChI");
    }
    const SMILES = document.getElementById("SMILESinput").value;
    if (!SMILESvalidator(SMILES)) {
      return displayError("Invalid SMILES");
    }
    const PubchemCID = document.getElementById("PubchemCIDinput").value;
    if (!PubchemCIDvalidator(PubchemCID)) {
      return displayError("Invalid PubchemCID");
    }
    chemicalJSON = {
      names: chemicalNames,
      "pure substance": true,
      CAS: CAS,
      InChIKey: InChIKey,
      InChI: InChI,
      SMILES: SMILES,
      PubchemCID: PubchemCID,
      URL: wikidata,
    };

    /*document.getElementById("moleculeDisplay").style.display = "block";
    document.getElementById("moleculeHeader").style.display = "block";*/
    document.getElementById("moleculecontainer").style.display = "flex";

    let moleculeOptions = {};
    let reactionOptions = {};

    let sd = new SmiDrawer(moleculeOptions, reactionOptions);
    sd.draw(chemicalJSON["SMILES"], "#moleculeDisplay");
  } else {
    /*document.getElementById("moleculeHeader").style.display = "none";
    document.getElementById("moleculeDisplay").style.display = "none";*/
    document.getElementById("moleculecontainer").style.display = "none";

    chemicalJSON = {
      names: chemicalNames,
      "pure substance": false,
      CAS: CAS,
      URL: wikidata,
    };
  }
  let modal = document.getElementById("infoModal");

  let span = document.getElementsByClassName("close")[0];

  
  modal.style.display = "block";
  
  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.getElementById("chemicalRecordOutput").style.display = "flex";
  document.getElementById("copy").style.display = "block";
  document.getElementById("outputHeader").innerHTML =
    "Generated Chemical Record: ";
  document.getElementById("JSONChemicalRecord").innerHTML = JSON.stringify(
    chemicalJSON,
    null,
    4
  );
  //document.getElementById("chemicalRecordOutput").scrollIntoView({behavior: "smooth"});
};

let InChIKeyvalidator = (InChIKey) => {
  const InChIKeyregex = /^[A-Za-z\d-]{14}-[A-Za-z\d]{10}-[A-Za-z\d]$/;
  return InChIKeyregex.test(InChIKey);
};

let InChIvalidator = (InChI) => {
  const InChIregex = /^InChI\=1S?\/[^\s]+(\s|$)/;
  return InChIregex.test(InChI);
};

let SMILESvalidator = (SMILES) => {
  //const SMILESregex = /^([^J][0-9BCOHNSOPrIFla@+\-\[\]\(\)\\=#$]{6,})$/ig;
  const SMILESregex = /^([A-Za-z0-9@\.\+\-\[\]\(\)\\\/%=#$]{1,})$/;
  return SMILESregex.test(SMILES);
};

let PubchemCIDvalidator = (PubchemCID) => {
  const PubchemCIDregex = /^\d+$/;
  return PubchemCIDregex.test(PubchemCID);
};

let CASValidator = (CAS) => {
  if (!CAS || !CAS.match(/[0-9]{2,7}-[0-9]{2}-[0-9]/)) {
    return false;
  }

  let sum = 0;
  let digits = CAS.replace(/-/g, "");

  for (let i = digits.length - 2; i >= 0; i--) {
    sum += parseInt(digits[i]) * (digits.length - i - 1);
  }

  return sum % 10 === parseInt(CAS.slice(-1));
};

let wikidataValidator = (wikidata) => {
  try {
    new URL(wikidata.trim());
    return true;
  } catch (e) {
    return false;
  }
  //return wikidata.trim().startsWith("https://www.wikidata.org/wiki/Q");
};

let displayError = (error) => {
  let modal = document.getElementById("infoModal");

  let span = document.getElementsByClassName("close")[0];

  
  modal.style.display = "block";
  
  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
  document.getElementById("chemicalRecordOutput").style.display = "flex";
  document.getElementById("copy").style.display = "none";
  document.getElementById("moleculecontainer").style.display = "none";


  document.getElementById("error").innerHTML = error;
};

let copyJSON = () => {
  let copiedJSON = document.getElementById("JSONChemicalRecord");
  navigator.clipboard.writeText(copiedJSON.innerHTML);
  document.getElementById("snackbar").className = "show";
  setTimeout(() => {
    document.getElementById("snackbar").className = document
      .getElementById("snackbar")
      .className.replace("show", "");
  }, 3000);
};

let handleCheckbox = () => {
  if (document.getElementById("puresubstanceinput").checked) {
    document.getElementById("hiddenfields").style.display = "block";
    let inputNum = document.getElementById("hiddenfields").children.length;
    for (let i = 0; i < inputNum; i++) {
      document.getElementById("hiddenfields").children[
        i
      ].children[1].required = true;
    }
  } else {
    document.getElementById("hiddenfields").style.display = "none";
    let inputNum = document.getElementById("hiddenfields").children.length;
    for (let i = 0; i < inputNum; i++) {
      document.getElementById("hiddenfields").children[
        i
      ].children[1].required = false;
    }
  }
};
