

// "https://www.merinfo.se/search?who=0702990271"


var info = {};


function getHTML(link) {
  let PROXY = "https://ghg7femhx6.execute-api.us-east-1.amazonaws.com/";
  let finalLink = PROXY + link;
  response = fetch(finalLink).then(response => response.text()).then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      let href = doc.getElementsByClassName("link-primary")[0].href;
      info["searchedLink"] = href;
      getCODE(href);
  }).catch(err => console.log(err))
};

function getCODE(link) {
  let PROXY = "https://ghg7femhx6.execute-api.us-east-1.amazonaws.com/";
  let finalLink = PROXY + link;
  response = fetch(finalLink).then(response => response.text()).then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      let href = doc.getElementById("ratsit-lonekollen-url").href;
      let code = href.replace("https://www.merinfo.se/redirect/lonekollen/", "");
      info["code"] = code;
      getAPI(code);
  }).catch(err => console.log(err))
};

function getAPI(code) {
    let finalLink = "https://www.merinfo.se/api/v1/people/" + code + "/vehicles";
  response = fetch(finalLink, {method: "POST", headers: {'Content-type': 'application/json', 'Accept': 'text/plain'}}).then(response => response.json()).then((data) => {
      info["car count"] = data["data"]["count"];
      info["car link"] = data["data"]["url"];
      if (data["data"]["url"] != "") {
          getCARS(data["data"]["url"]);
      };
  }).catch(err => console.log(err))
};

function getCARS(link) {
  let PROXY = "https://ghg7femhx6.execute-api.us-east-1.amazonaws.com/";
  let finalLink = PROXY + link;
  response = fetch(finalLink).then(response => response.text()).then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      let carLinks = doc.getElementsByClassName("clickable-tr");
      for (let i = 0; i < 3; i++) {
          let badLink = carLinks[i].firstElementChild.firstElementChild.href;
          let goodPart = badLink.substr(badLink.length-21);
          let goodLink = "https://biluppgifter.se/brukare/person/" + goodPart;
          isCREDIT(goodLink);
      };
      // Write from here :)
      
      displayDetails(info);
      
  }).catch(err => console.log(err))
};

function isCREDIT(link) {
  let PROXY = "https://ghg7femhx6.execute-api.us-east-1.amazonaws.com/";
  let finalLink = PROXY + link;
  response = fetch(finalLink).then(response => response.text()).then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      let creditValue = doc.getElementById("data-credit").textContent;
      var byId = doc.getElementById("box-data").getElementsByClassName("col-12")[0].getElementsByClassName("card card-body card-data")[0].getElementsByClassName("list-data enlarge")[0];
      let fabrikat = byId.getElementsByClassName("value")[0].textContent;
      let modell = byId.getElementsByClassName("value")[1].textContent;
      let year = String(doc.getElementById("data-vehicle-year").textContent) + "/" + String(doc.getElementById("data-model-year").textContent)
      let cd = {"kredit": creditValue, "fabrikat": fabrikat, "modell": modell, "year": year};
      for (let i = 0; i < info["car count"]; i++) {
          if (!(i in info)) {
              info[i] = cd
              break;
          };
      };
      //DONT WRITE FROM HERE !!
  }).catch(err => console.log(err))
};

//getHTML("https://www.merinfo.se/search?who=0702990271");
function getNumber() {
    var input = document.getElementById('inputNumber').value;
    getHTML("https://www.merinfo.se/search?who=" + input.replace("https://www.merinfo.se/search?who=", ""));
};



function displayDetails(info) {
    console.log(info);
    
};


//getHTML("https://www.merinfo.se/search?who=axel+john+eklund&where=");





/*

function getNumber() {
    var input = document.getElementById('inputNumber').value;
    //console.log(input);
    //alert(input);

    displayDetails(input);
}

function displayDetails(userPhone) {
    console.log(userPhone);
    var fullDiv = document.createElement('div');
    fullDiv.className = "flexbox-container-2"
}


*/
