"use strict"

// Tabs

function openContent(evt, content) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("product__detail-tabs-content");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(content).style.display = "flex";
    evt.currentTarget.className += " active";
}

document.getElementById("defaultOpen").click();