

// "https://www.merinfo.se/search?who=0702990271"

//https://ghg7femhx6.execute-api.us-east-1.amazonaws.com/

var info = {};
/*
dict.push({
    key:   "keyName",
    value: "the value"
});
*/


function getHTML(link) {
  let PROXY = "https://ghg7femhx6.execute-api.us-east-1.amazonaws.com/";
  //let finalLink = proxy + link;
  let finalLink = PROXY + link;
  response = fetch(finalLink).then(response => response.text()).then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      console.log(doc);
      let href = doc.getElementsByClassName("link-primary")[0].href;
      console.log("person href:", href);
      info["searchedLink"] = href;
      console.log("stored:", info);
      getCODE(href);
  }).catch(err => console.log(err))
};

function getCODE(link) {
  let PROXY = "https://ghg7femhx6.execute-api.us-east-1.amazonaws.com/";
  let finalLink = PROXY + link;
  response = fetch(finalLink).then(response => response.text()).then((html) => {
      //console.log("HTML:::", html);
      //ratsit-lonekollen-url
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      let href = doc.getElementById("ratsit-lonekollen-url").href;
      //console.log(href);
      let code = href.replace("https://www.merinfo.se/redirect/lonekollen/", "");
      //console.log(code)
      info["code"] = code;
      getAPI(code);
  }).catch(err => console.log(err))
};

function getAPI(code) {
    let finalLink = "https://www.merinfo.se/api/v1/people/" + code + "/vehicles";
  response = fetch(finalLink, {method: "POST", headers: {'Content-type': 'application/json', 'Accept': 'text/plain'}}).then(response => response.json()).then((data) => {
      //console.log(JSON.parse(data));
      //console.log(typeof(data));
      //console.log("getAPI first data:", data);
      //console.log(data["data"]["url"]);
      info["car count"] = data["data"]["count"];
      info["car link"] = data["data"]["url"];
      //console.log(info);
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
      //console.log(doc);
      let carLinks = doc.getElementsByClassName("clickable-tr");
      //console.log(carLinks);
      for (let i = 0; i < 3; i++) {
          //console.log(carLinks[i].innerHTML);
          let badLink = carLinks[i].firstElementChild.firstElementChild.href;
          let goodPart = badLink.substr(badLink.length-21);
          let goodLink = "https://biluppgifter.se/brukare/person/" + goodPart;
          console.log(goodLink);
          isCREDIT(goodLink);
      };
      console.log(info);
  }).catch(err => console.log(err))
};

function isCREDIT(link) {
  let PROXY = "https://ghg7femhx6.execute-api.us-east-1.amazonaws.com/";
  let finalLink = PROXY + link;
  response = fetch(finalLink).then(response => response.text()).then((html) => {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, 'text/html');
      let creditValue = doc.getElementById("data-credit").textContent;
      //console.log(creditValue);
      var byId = doc.getElementById("box-data").getElementsByClassName("col-12")[0].getElementsByClassName("card card-body card-data")[0].getElementsByClassName("list-data enlarge")[0];
      let fabrikat = byId.getElementsByClassName("value")[0].textContent;
      let modell = byId.getElementsByClassName("value")[1].textContent;
      let year = String(doc.getElementById("data-vehicle-year").textContent) + "/" + String(doc.getElementById("data-model-year").textContent)
      //console.log(creditValue, fabrikat, modell, year);
      //bilar.push({"kredit": creditValue, "fabrikat": fabrikat, "modell": modell, "year": year});
      let cd = {"kredit": creditValue, "fabrikat": fabrikat, "modell": modell, "year": year};
      console.log(cd)
      for (let i = 0; i < info["car count"]; i++) {
          if (!(i in info)) {info[i] = cd}
      }
      
      //console.log(info);
      
  }).catch(err => console.log(err))
};

getHTML("https://www.merinfo.se/search?who=0702990271");
//getHTML("https://www.merinfo.se/search?who=axel+john+eklund&where=");
console.log(info);
