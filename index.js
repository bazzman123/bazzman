

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
      console.log("getAPI first data:", data);
      //console.log(data["data"]["url"]);
      info["car count"] = data["data"]["count"];
      info["car link"] = data["data"]["url"];
      console.log(info);
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
      console.log(doc);
      let carLinks = doc.getElementsByClassName("clickable-tr");
      console.log(carLinks);
      for (let i = 0; i < 3; i++) {
          //console.log(carLinks[i].innerHTML);
          let badLink = carLinks[i].firstElementChild.firstElementChild.href;
          //console.log(badLink.substr(badLink.length-21));
          let goodLink = "https://biluppgifter.se/brukare/person/" + badLink;
          console.log(goodLink);
      };
  }).catch(err => console.log(err))
};

getHTML("https://www.merinfo.se/search?who=0702990271");
//getHTML("https://www.merinfo.se/search?who=axel+john+eklund&where=");
console.log(info);
