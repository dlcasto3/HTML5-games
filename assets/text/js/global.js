var STATUS = "RENNOVATION";
var sidenav = document.getElementById("sidenav");
        var snbtn = document.getElementById("smallnavbtn");
        var snbtnsub = document.getElementById("snbtnsub");
        sidenav.style.left = "-200px";
        function toggleSideNav() {
            if (sidenav.style.left == "-200px") {
                sidenav.style.left = "0";
                snbtnsub.classList.remove("wicon-bar-menu");
                snbtnsub.classList.add("wicon-xmark");
                snbtn.style.left = "140px";
                document.addEventListener("click", function(event) {
                    if (!sidenav.contains(event.target) && !snbtn.contains(event.target)) {
                        sidenav.style.left = "-200px";
                        snbtnsub.classList.add("wicon-bar-menu");
                        snbtnsub.classList.remove("wicon-xmark");
                        snbtn.style.left = "0";
                        document.removeEventListener("click");
                    }
                });
            } else {
                sidenav.style.left = "-200px";
                snbtnsub.classList.add("wicon-bar-menu");
                snbtnsub.classList.remove("wicon-xmark");
                snbtn.style.left = "0";
                document.removeEventListener("click");
            }
        }
        async function updateStatus(elem) {
            var col;
            if (STATUS == "RENNOVATION") {
                col = "#ffd300";
            } else if (STATUS == "STABLE") {
                col = "#00b4d8";
            } else if (STATUS == "MEWO") {
                col = "#7600bc";
            } else if (STATUS == "MINOR CHANGES") {
                col = "#1efc04";
            } else if (STATUS == "BLOCKED") {
                col = "#ef4060";
            } else {
                STATUS = "ERROR";
                col = "#ff4444";
            }
            elem.innerHTML = "Status: <span style='color: " + col + "; text-shadow: 0px 0px 10px " + col + "'>" + STATUS + "</span>";
         }
         function cloakTab() {
             if (localStorage.getItem("wcCloak")) {
                 var a = localStorage.getItem("wcCloak").split(", ");
                 document.head.title = a[1];
                 var favicon = document.querySelector("link[rel~='icon']");
                 if (!favicon) {
                     favicon = document.createElement('link');
                     favicon.rel = 'icon';
                     document.head.appendChild(favicon);
                 }
                 favicon.href = a[2];
             } else {
                 return;
             }
         }
         document.addEventListener("DOMContentLoaded", function() {
            document.getElementById("footerYear").innerText = new Date().getFullYear();
            updateStatus(document.getElementById("status"));
            cloakTab();
        });
